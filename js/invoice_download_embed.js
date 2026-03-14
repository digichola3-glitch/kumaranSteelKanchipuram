(function () {
  console.log("Vify:Invoice: extension loaded - invoice download embed");
  // var btn = document.querySelector('[data-block-handle="invoice_download_embed"]');
  var btn = document.querySelector(".vop-invoice-download");
  if (btn) {
    // turn off embed button when have block button
    var btnBlock = document.querySelector(
      '[data-block-handle="invoice_download"]'
    );
    if (btnBlock) {
      btn.style.display = "none";
      return;
    }

    var selfBtn = btn.querySelector(".v-download-btn");
    var refundBtn = document.querySelector(
      ".vop-refund-download .v-download-grp.refund-download .v-download-btn"
    );

    if (
      refundBtn &&
      selfBtn &&
      refundBtn.dataset?.singleLine !== "true" &&
      selfBtn.dataset?.singleLine !== "true"
    ) {
      refundBtn.before(selfBtn);
      return;
    }

    // insert btn before refund download button
    var refundDownload = document.querySelector(
      ".vop-refund-download .refund-download.v-inserted"
    );
    if (refundDownload) {
      refundDownload.classList.add("v-inserted");
      refundDownload.before(btn);
      return;
    }

    // select target of theme to insert
    var is_inserted = false;
    var target = document.querySelector(
      [
        ".customer.order table",
        "[class*=account][class*=order] table",
        "[class*=section] table",
        "main table",
      ].join(",")
    );
    if (target) {
      target.after(btn);
      is_inserted = true;
    }

    // Support for CustomerHub app
    const tryInsertCustomerHub = (attempts = 0, maxAttempts = 10) => {
      var customer_hub = document.querySelector(
        ".customerhub-parent .chContent-Body-Page > div"
      );
      if (customer_hub) {
        customer_hub.after(btn);
        is_inserted = true;
      } else if (attempts < maxAttempts) {
        setTimeout(() => tryInsertCustomerHub(attempts + 1, maxAttempts), 500);
      }
    };
    tryInsertCustomerHub();

    if (!is_inserted) {
      btn.classList.add("v-download-btn-fixed");
    }
  }
})();
