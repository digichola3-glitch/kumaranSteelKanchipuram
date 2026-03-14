(function () {
  console.log("Vify:Invoice: extension loaded - refund download embed");
  // var btn = document.querySelector('[data-block-handle="refund_download_embed"]');
  var btn = document.querySelector(".vop-refund-download");
  if (btn) {
    // turn off embed button when have block button
    var btnBlock = document.querySelector(
      '[data-block-handle="refund_download"]'
    );
    if (btnBlock) {
      btn.style.display = "none";
      return;
    }

    var selfBtn = btn.querySelector(".v-download-btn");
    var invoiceBtn = document.querySelector(
      ".vop-invoice-download .v-download-grp.invoice-download .v-download-btn"
    );

    if (
      invoiceBtn &&
      selfBtn &&
      invoiceBtn.dataset?.singleLine !== "true" &&
      selfBtn.dataset?.singleLine !== "true"
    ) {
      invoiceBtn.after(selfBtn);
      return;
    }

    // insert btn after invoice download button
    var invoiceDownload = document.querySelector(
      ".vop-invoice-download .invoice-download.v-inserted"
    );
    if (invoiceDownload) {
      invoiceDownload.classList.add("v-inserted");
      invoiceDownload.after(btn);
      return;
    }

    // select target of theme to insert
    var is_inserted = false;
    var target = document.querySelector(
      [
        ".customer.order table, [class*=account][class*=order] table, [class*=section] table",
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
