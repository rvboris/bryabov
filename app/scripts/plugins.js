(function ($) {
    'use strict';

    FastClick.attach(document.body);

    WebFont.load({
        custom: {
            families: ['Open Sans']
        }
    });

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();

        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });

        return o;
    };

    $(document).ready(function () {
        if (!_.isUndefined($.fn.placeholder)) {
            $('input[placeholder], textarea[placeholder]').placeholder();
        }

        if (!_.isUndefined($.fn.magnificPopup)) {
            $('.magnificPopup').magnificPopup({
                disableOn: 400,
                closeOnContentClick: true,
                type: 'image'
            });

            $('.magnificPopup-gallery').magnificPopup({
                disableOn: 400,
                type: 'image',
                gallery: {
                    enabled: true
                },
                mainClass: 'mfp-fade'
            });
        }

        if (!_.isUndefined($.fn.isotope) && ($(window).width() > 767)) {
            $('.portfolio-items').imagesLoaded(function () {
                var container = $('.portfolio-items');

                container.isotope({
                    itemSelector: '.item',
                    layoutMode: 'masonry'
                });

                $('.portfolio-filter li a').click(function () {
                    $('.portfolio-filter li a').removeClass('active');
                    $(this).addClass('active');

                    var selector = $(this).attr('data-filter');

                    container.isotope({
                        filter: selector
                    });

                    return false;
                });

                $(window).resize(function () {
                    container.isotope({});
                });
            });
        }
    });

    window.lang = new Lang('en');
    window.lang.dynamic('ru', 'languages/ru.json');
})(window.jQuery);
