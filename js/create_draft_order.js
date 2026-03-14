var vDraftOrder = (function () {
  console.log("Vify:Invoice: extension loaded - create draft order - script");

  var vBlockWrapperClass = ".v-block-wrapper.create-draft-order-wrapper";
  var draftBtn = document.querySelector(vBlockWrapperClass);
  if (!draftBtn) {
    return; // stop when no button found
  }

  // Try to insert button (wait the button is rendered)
  const tryInsertButton = (attempts = 0, maxAttempts = 10) => {
    var is_inserted = false;

    // Prevent duplicate button insertions by removing leftover clones first
    document
      .querySelectorAll(vBlockWrapperClass + ".v-cloned-btn")
      .forEach((btn) => btn.remove());

    var cartCtas = document.querySelectorAll(".cart__ctas");
    if (cartCtas && cartCtas.length > 0) {
      cartCtas.forEach(function (cartCta, i) {
        if (i === 0) {
          draftBtn.style.display = "flex";
          cartCta.after(draftBtn);
          is_inserted = true;
          return;
        }
        var cloned = draftBtn.cloneNode(true);
        cloned.classList.add("v-cloned-btn");
        cloned.style.display = "flex";
        cartCta.after(cloned);
      });
      is_inserted = true;
    }

    if (!is_inserted) {
      // or insert after checkout button has button[name="checkout"]
      var checkoutBtn = document.querySelector(
        'button[name="checkout"], [class*="cart-checkout-button"]'
      );
      if (checkoutBtn) {
        var checkoutBtnParentNode = checkoutBtn.parentNode;
        var cartForm = checkoutBtn.closest('form[action*="/cart"]');
        // check if checkoutBtn is children of cartForm
        if (cartForm) {
          if (
            cartForm.contains(checkoutBtnParentNode) &&
            cartForm.contains(draftBtn) === false
          ) {
            draftBtn.style.display = "flex";
            checkoutBtnParentNode.after(draftBtn);
            is_inserted = true;
          }
        } else {
          draftBtn.style.display = "flex";
          checkoutBtn.parentNode.after(draftBtn);
          is_inserted = true;
        }
      }
    }

    if (!is_inserted) {
      // or find next class to insert the button
      var cartBlocks = document.querySelectorAll(".cart__blocks");
      if (cartBlocks && cartBlocks.length > 0) {
        cartBlocks.forEach(function (cartBlock, i) {
          if (i === 0) {
            draftBtn.style.display = "flex";
            cartBlock.insertBefore(draftBtn, null);
            is_inserted = true;
            return;
          }
          var cloned = draftBtn.cloneNode(true);
          cloned.classList.add("v-cloned-btn");
          cloned.style.display = "flex";
          cartBlock.insertBefore(cloned, null);
        });
        is_inserted = true;
      }
    }

    if (!is_inserted) {
      // find cart drawer footer to insert the button
      var cartBlock = document.querySelector(
        "[class*=cart] [class^=drawer__footer][class$=footer], [class*=cart][class*=drawer] [class*=footer]"
      );
      if (cartBlock) {
        var cloned = draftBtn.cloneNode(true);
        cloned.classList.add("v-cloned-btn");
        cloned.style.display = "flex";
        cartBlock.insertBefore(cloned, null);
        is_inserted = true;
      }
    }

    if (is_inserted) {
      console.log("Vify: Draft Order Button Inserted");

      // Look for the cart token in cookies or locally if available to sync UI quickly
      let cartToken = null;
      try {
        const match = document.cookie.match(/(^| )cart=([^;]+)/);
        if (match) cartToken = match[2];
      } catch (e) {}

      updateUIForExistingDraftOrder(cartToken);
    } else if (attempts < maxAttempts) {
      setTimeout(() => tryInsertButton(attempts + 1, maxAttempts), 500);
    }
  };

  tryInsertButton();

  // Watch entire cart form/section, not just drawer
  function listenToCartChanges() {
    const cartSelectors = [
      "cart-drawer",
      ".cart-drawer",
      'form[action*="/cart"]',
      ".cart",
      "[data-cart]",
      "#cart",
    ];

    cartSelectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        const observer = new MutationObserver(() => {
          if (element.querySelector(vBlockWrapperClass)) return;
          tryInsertButton();
        });
        observer.observe(element, { childList: true, subtree: true });
      }
    });

    // Listen to Shopify's cart:updated event (fired by many themes)
    document.addEventListener("cart:updated", function () {
      tryInsertButton();
    });

    // Listen to theme-specific events
    document.addEventListener("theme:cart:change", function () {
      tryInsertButton();
    });

    // Intercept fetch requests to /cart/add.js, /cart/update.js, /cart/change.js
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch.apply(this, args).then((response) => {
        const url =
          typeof args[0] === "string"
            ? args[0]
            : args[0] && args[0].url
            ? args[0].url
            : "";
        if (url && url.includes("/cart") && !url.includes("cart.js")) {
          setTimeout(() => tryInsertButton(), 300);
        }
        return response;
      });
    };
  }

  /** run logic */

  let vAddress = {};

  // load vAddress from localStorage
  if (typeof Storage !== "undefined" && localStorage.getItem("vifyAddress")) {
    vAddress = JSON.parse(localStorage.getItem("vifyAddress"));
  }

  var modal = document.querySelector(".v-address-modal");
  var modalTriggers = document.querySelectorAll(".v-address-modal-trigger");

  async function getCart() {
    return await fetch(window.Shopify.routes.root + "cart.js")
      .then((res) => res.json())
      .then((data) => data);
  }

  async function create(vCustomer, lang) {
    var requireAddress = draftBtn.dataset.requireAddress;
    let customer = vCustomer;
    // show error if no customer and address is empty object
    if (
      (!customer || !Object.keys(customer).length) &&
      !Object.keys(vAddress).length &&
      requireAddress == "true"
    ) {
      var error = document.querySelectorAll(
        ".create-draft-order-wrapper .v-errors"
      );
      if (error && error.length > 0) {
        error.forEach((err) => {
          const messageAddress = err.querySelector(".message-address");
          if (messageAddress) {
            err.classList.remove("hidden");
            messageAddress.style.display = "inline";
          }
        });
      }
      // show the popup address modal
      modalOpen();
      return;
    }

    if (
      (!customer || !Object.keys(customer).length) &&
      Object.keys(vAddress).length
    ) {
      let { note, email, ...address } = vAddress; // clone object and remove note and email
      customer = {
        email: vAddress.email,
        first_name: vAddress.first_name,
        last_name: vAddress.last_name,
        phone: vAddress.phone,
        tags: "",
        note: vAddress.note,
        addresses: [address],
        default_address: address,
      };
    }

    var cart = await getCart();

    if (!cart.items?.length) {
      return;
    }

    // enable loading spinner on all buttons
    document
      .querySelectorAll("#v-btn-draft_order .v-loading-overlay")
      ?.forEach((loading) => loading.classList.remove("disabled"));

    document
      .querySelectorAll(".create-draft-order-wrapper .v-success")
      ?.forEach((message) => {
        message.classList.add("hidden");
      });

    return new Promise((resolve, reject) => {
      var proxyPrefix = "/apps/pdf-vify"; // production
      // var proxyPrefix = '/apps/robert-dev/api'; // dev
      // var proxyPrefix = '/apps/vify-invoice/api'; // develop

      fetch(proxyPrefix + "/proxy/draft-order/create", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customer: customer ?? null,
          lang: lang ?? null,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          var errors;
          if (data?.errors) {
            errors = Object.values(data.errors);
          }

          resolve(data);

          if (errors) {
            document
              .querySelectorAll(".create-draft-order-wrapper .v-errors")
              ?.forEach((message) => {
                message.classList.remove("hidden");
                const messageContent = message.querySelector(".message");
                if (messageContent) {
                  messageContent.textContent = errors.join(", ");
                }
              });
          }
          if (data?.invoice_url) {
            // Save draft order info to localStorage
            if (typeof Storage !== "undefined" && cart.token) {
              localStorage.setItem("vifyDraftOrder_" + cart.token, "true");
              updateUIForExistingDraftOrder();
            }

            document
              .querySelectorAll(".create-draft-order-wrapper .v-success")
              ?.forEach((message) => {
                message.classList.remove("hidden");
                message
                  .querySelectorAll(".download-link")
                  ?.forEach((element) => {
                    const newHref =
                      proxyPrefix +
                      "/pdf-preview/draft-order?order_id=" +
                      data.id?.replace("gid://shopify/DraftOrder/", "") +
                      "&locale=" +
                      lang;
                    element.setAttribute("href", newHref);
                    element.setAttribute("target", "_blank"); // nếu cần mở tab mới
                  });
              });
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        })
        .finally(() => {
          // close loading spinner on all buttons
          document
            .querySelectorAll("#v-btn-draft_order .v-loading-overlay")
            ?.forEach((loading) => loading.classList.add("disabled"));
        });
    });
  }

  function clearCart() {
    document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  }

  async function updateUIForExistingDraftOrder(cartToken = null) {
    if (!cartToken) {
      const cart = await getCart();
      if (!cart.token) return;
      cartToken = cart.token;
    }

    const hasDraftOrder = localStorage.getItem("vifyDraftOrder_" + cartToken);
    if (hasDraftOrder) {
      const updateLabel = draftBtn.dataset.updateLabel;
      if (updateLabel) {
        // Find both the original and any cloned buttons
        document
          .querySelectorAll("#v-btn-draft_order .v-regular span")
          .forEach((span) => {
            span.textContent = updateLabel;
          });
      }

      // Add a class or attribute to the wrapper so that both original and clones show the clear cart button via CSS
      document.querySelectorAll(vBlockWrapperClass).forEach((wrapper) => {
        wrapper.setAttribute("data-has-draft", "true");
      });
      document.querySelectorAll(".v-cloned-btn").forEach((wrapper) => {
        wrapper.setAttribute("data-has-draft", "true");
      });
    }
  }

  function loadAddressForm(address) {
    const selectElement = modal.querySelector(
      'select[name="address[province]"]'
    );
    const inputElement = modal.querySelector('input[name="address[province]"]');
    if (selectElement && selectElement.value.trim() !== "") {
      p = selectElement;
    } else {
      p = inputElement ? inputElement : undefined;
    }
    let addressForm = {
      first_name: modal.querySelector('[name="address[first_name]"]'),
      last_name: modal.querySelector('[name="address[last_name]"]'),
      email: modal.querySelector('[name="address[email]"]'),
      address1: modal.querySelector('[name="address[address1]"]'),
      address2: modal.querySelector('[name="address[address2]"]'),
      city: modal.querySelector('[name="address[city]"]'),
      province: modal.querySelector('[name="address[province]"]'),
      country: modal.querySelector('[name="address[country]"]'),
      zip: modal.querySelector('[name="address[zip]"]'),
      phone: modal.querySelector('[name="address[phone]"]'),
      note: modal.querySelector('[name="address[note]"]'),
    };

    if (address && Object.keys(vAddress).length) {
      for (const key in addressForm) {
        if (address[key]) {
          addressForm[key].value = address[key];
        }
      }
    }

    let addressData = {};
    for (const key in addressForm) {
      if (addressForm[key]) {
        addressData[key] = addressForm[key].value;
      }
    }
    return addressData;
  }

  function getSelectedCountryCode() {
    const countrySelect = document.getElementById("AddressCountryNew");
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const countryCode = selectedOption.getAttribute("data-code");
    console.log(countryCode);
    return countryCode || "US";
  }
  function validateAddressForm() {
    let errors = [];
    const modal = document.querySelector(".v-address-modal");

    try {
      // Validate Email
      const emailInput = modal.querySelector('[name="address[email]"]');
      const emailError = "Invalid email address";

      if (!emailInput.checkValidity()) {
        errors.push(emailError);
        emailInput.style.color = "red";
      } else {
        emailInput.style.color = "inherit";
      }

      // Validate Phone
      const phoneInput = document.getElementById("AddressPhoneNew");
      const rawPhone = phoneInput.value.trim();
      const countryCode = getSelectedCountryCode();

      try {
        const number = libphonenumber.parsePhoneNumber(rawPhone, countryCode);

        if (!number.isValid()) {
          errors.push("Invalid phone number");
          phoneInput.style.color = "red";
        } else {
          phoneInput.style.color = "inherit";
          phoneInput.value = number.formatInternational();
        }
      } catch (e) {
        errors.push("Invalid phone format");
        phoneInput.style.color = "red";
      }

      // Nếu có lỗi → không submit
      if (errors.length > 0) {
        console.warn("Form validation errors:", errors);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Validation error:", err);
      return true;
    }
  }

  function saveAddress() {
    var error = document.querySelectorAll(
      ".create-draft-order-wrapper .v-errors"
    );
    if (error && error.length > 0) {
      error.forEach((err) => {
        err.classList.add("hidden");
      });
    }

    if (validateAddressForm()) {
      modalClose();
    }
    vAddress = loadAddressForm();

    // save vAddress to localStorage
    if (typeof Storage !== "undefined") {
      localStorage.setItem("vifyAddress", JSON.stringify(vAddress));
    }
  }

  function modalCloseEvt() {
    modalClose();
  }

  function modalSaveEvt() {
    saveAddress();
  }

  let modalCloseBtn, modalSaveBtn;

  function modalOpen() {
    modal.classList.add("v-address-modal--active");

    modalCloseBtn = modal.querySelector(".v-address-modal .close");
    modalSaveBtn = modal.querySelector(".v-address-modal .save");

    modalCloseBtn && modalCloseBtn.addEventListener("click", modalCloseEvt);
    modalSaveBtn && modalSaveBtn.addEventListener("click", modalSaveEvt);

    loadAddressForm(vAddress);
  }

  function modalClose() {
    modal.classList.remove("v-address-modal--active");
    modalCloseBtn && modalCloseBtn.removeEventListener("click", modalCloseEvt);
    modalSaveBtn && modalSaveBtn.removeEventListener("click", modalSaveEvt);
  }

  function runModal() {
    if (!modal) {
      return;
    }

    if (modal && modalTriggers?.length) {
      modalTriggers.forEach((modalTrigger) => {
        modalTrigger.addEventListener("click", function (event) {
          event.preventDefault();
          modalOpen();
        });
        modal.addEventListener("click", function (e) {
          if (e.target === modal) {
            modalClose();
          }
        });
      });
    }
  }

  (function run() {
    listenToCartChanges();
    runModal();
    updateUIForExistingDraftOrder();
  })();

  return {
    create,
    clearCart,
    modalOpen,
    modalClose,
  };
})();
