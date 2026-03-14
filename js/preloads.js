
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.CgsWKOqO.js","/cdn/shopifycloud/checkout-web/assets/c1/app.DmsdIZrH.js","/cdn/shopifycloud/checkout-web/assets/c1/vendor.JbqJ5lU4.js","/cdn/shopifycloud/checkout-web/assets/c1/browser.BJ2_F7JV.js","/cdn/shopifycloud/checkout-web/assets/c1/FullScreenBackground.D8QNlR62.js","/cdn/shopifycloud/checkout-web/assets/c1/shop-discount-offer.Bx79Ndty.js","/cdn/shopifycloud/checkout-web/assets/c1/alternativePaymentCurrency.DroOZvQI.js","/cdn/shopifycloud/checkout-web/assets/c1/proposal.D97MTOLt.js","/cdn/shopifycloud/checkout-web/assets/c1/useHasOrdersFromMultipleShops.DZ_wvmLU.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.Dp3HBRm1.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.Bw9zqg7p.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentButtons.DPuhd4EY.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalPickup.CLnPvX8n.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedDeliveryAddress.g569OS0r.js","/cdn/shopifycloud/checkout-web/assets/c1/useForceShopPayUrl.D0_KM24M.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayLogo.BXZhYhq0.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedPayment.Cv5Mrz6J.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer.5rwqSCTq.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingGroupsSummary.D3_ETAlR.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.CcpzoYW4.js","/cdn/shopifycloud/checkout-web/assets/c1/PickupPointCarrierLogo.7LNQbPzO.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks.DIWQU9Wp.js","/cdn/shopifycloud/checkout-web/assets/c1/AddDiscountButton.BwhvyOIE.js","/cdn/shopifycloud/checkout-web/assets/c1/RememberMeDescriptionText.36N9yxQ6.js","/cdn/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer.8RJ5Vl32.js","/cdn/shopifycloud/checkout-web/assets/c1/MobileOrderSummary.Bbrpqvrt.js","/cdn/shopifycloud/checkout-web/assets/c1/OrderEditVaultedDelivery.CQz1M5Jb.js","/cdn/shopifycloud/checkout-web/assets/c1/SeparatePaymentsNotice.DAsdcI31.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblemsLineItemList.D6xFZiXi.js","/cdn/shopifycloud/checkout-web/assets/c1/flags.DSlMoOg7.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.BnRz6Ue9.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.sOC-Njqf.js","/cdn/shopifycloud/checkout-web/assets/c1/shipping-options.33nIakMt.js","/cdn/shopifycloud/checkout-web/assets/c1/DutyOptions.DTeeW6BG.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodSelector.D6E2PyzH.js","/cdn/shopifycloud/checkout-web/assets/c1/SubscriptionPriceBreakdown.CdFOnu1R.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.D7EkV1ZR.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/FullScreenBackground.B_iZlQze.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useHasOrdersFromMultipleShops.CCAjbnEB.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.CKTqepKH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalPickup.BhtheElV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/AddDiscountButton.CZ33y7Va.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.7lB-c-sA.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayLogo.BrcQzLuH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DutyOptions.LcqrKXE1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PickupPointCarrierLogo.DuZuWHqZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.BSemv9tH.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = [];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  