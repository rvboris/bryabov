(function ($) {
    'use strict';

    function ieViewportFix() {
        var msViewportStyle = document.createElement('style');

        msViewportStyle.appendChild(
            document.createTextNode(
                '@-ms-viewport { width: device-width; }'
            )
        );

        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            msViewportStyle.appendChild(
                document.createTextNode(
                    '@-ms-viewport { width: auto !important; }'
                )
            );
        }

        document.getElementsByTagName('head')[0].
        appendChild(msViewportStyle);
    }

    function setDimensionsPieCharts() {
        $('.pie-chart').each(function () {
            var $t = $(this);
            var n = $t.parent().width();
            var r = $t.attr('data-barSize');

            if (n < r) {
                r = n;
            }

            $t.css('height', r);
            $t.css('width', r);
            $t.css('line-height', r + 'px');

            $t.find('i').css({
                'line-height': r + 'px',
                'font-size': r / 3
            });
        });
    }

    function animatePieCharts() {
        if (!_.isUndefined($.fn.easyPieChart)) {
            $('.pie-chart').each(function () {
                var $t = $(this);
                var n = $t.parent().width();
                var r = $t.attr('data-barSize');

                if (n < r) {
                    r = n;
                }

                $t.easyPieChart({
                    animate: 1300,
                    lineCap: 'square',
                    lineWidth: $t.attr('data-lineWidth'),
                    size: r,
                    barColor: $t.attr('data-barColor'),
                    trackColor: $t.attr('data-trackColor'),
                    scaleColor: 'transparent',
                    onStep: function (from, to, percent) {
                        $(this.el).find('.pie-chart-percent span').text(Math.round(percent));
                    }
                });
            });
        }
    }

    function animateMilestones() {
        $('.milestone:in-viewport').each(function () {
            var $t = $(this);
            var n = $t.find('.milestone-value').attr('data-stop');
            var r = parseInt($t.find('.milestone-value').attr('data-speed'));

            if (!$t.hasClass('already-animated')) {
                $t.addClass('already-animated');
                $({
                    countNum: $t.find('.milestone-value').text()
                }).animate({
                    countNum: n
                }, {
                    duration: r,
                    easing: 'linear',
                    step: function () {
                        $t.find('.milestone-value').text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $t.find('.milestone-value').text(this.countNum);
                    }
                });
            }
        });
    }

    function animateProgressBars() {
        $('.progress-bar .progress-bar-outer:in-viewport').each(function () {
            var $t = $(this);

            if (!$t.hasClass('already-animated')) {
                $t.addClass('already-animated');
                $t.animate({
                    width: $t.attr('data-width') + '%'
                }, 2000);
            }
        });
    }

    function handleContactForm() {
        if (!_.isUndefined($.fn.validate)) {
            $('#contact-form').validate({
                errorClass: 'validation-error',
                rules: {
                    name: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    message: {
                        required: true
                    }
                },
                messages: {
                    name: {
                        required: 'Field is required!'
                    },
                    email: {
                        required: 'Field is required!',
                        email: 'Please enter a valid email address'
                    },
                    message: {
                        required: 'Field is required!'
                    }
                },
                submitHandler: function (form) {
                    var result;

                    var parseAPPID = 'eedVjYt10kzEm191sR6U6UZgUneKjmBq7HsGxQfV';
                    var parseJSID = 'KLh5Cd0ji9PMNLp3ElZc6P3RheutlCyVGPBzZ4NY';

                    Parse.initialize(parseAPPID, parseJSID);
                    var MessageObject = Parse.Object.extend('MessageObject');

                    var message = new MessageObject();

                    message.save(_.omit($(form).serializeObject(), 'submit'), {
                        success: function () {
                            result = '<div class="alert success">';
                            result += '<i class="fa fa-check-circle-o"></i> ' +
                            window.lang.translate('The message has been sent!') + '</div>';

                            $('#contact-form').find('input[type=text], input[type=email], textarea').val('');
                            $('#formstatus').html(result);
                        },
                        error: function () {
                            result = '<div class="alert error">';
                            result += '<i class="fa fa-times-circle"></i> ' +
                            window.lang.translate('There was an error sending the message!') + '</div>';

                            $('#formstatus').html(result);
                        }
                    });
                }
            });
        }
    }

    function handleBackToTop() {
        $('#back-to-top').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
            return false;
        });
    }

    function showHidebackToTop() {
        if ($(window).scrollTop() > $(window).height() / 2) {
            $('#back-to-top').removeClass('gone');
            $('#back-to-top').addClass('visible');
        } else {
            $('#back-to-top').removeClass('visible');
            $('#back-to-top').addClass('gone');
        }
    }

    function handleCvContact() {
        if ($(window).width() > 767) {
            $('.cv-contact').animate({
                left: '-320px'
            });

            $('.cv-contact .cv-contact-toggle').click(function (e) {
                e.preventDefault();
                var div = $('.cv-contact');
                if (div.css('left') === '-320px') {
                    $('.cv-contact').animate({
                        left: '0'
                    }, 300);
                } else {
                    $('.cv-contact').animate({
                        left: '-320px'
                    }, 300);
                }
            });
        }
    }

    function getLanguage() {
        var lang = window.navigator.languages ? window.navigator.languages[0] : null;
        lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

        if (lang.indexOf('-') !== -1) {
            lang = lang.split('-')[0];
        }

        if (lang.indexOf('_') !== -1) {
            lang = lang.split('_')[0];
        }

        return lang;
    }

    function languageChange() {
        $('#lang-ru').on('click', function () {
            window.lang.change('ru');
            $('#languages button').removeClass('active');
            $(this).addClass('active');
        });

        $('#lang-en').on('click', function () {
            window.lang.change('en');
            $('#languages button').removeClass('active');
            $(this).addClass('active');
        });

        if (getLanguage() === 'ru') {
            $('#lang-ru').trigger('click');
        } else {
            $('#lang-en').trigger('click');
        }
    }

    $(document).ready(function () {
        ieViewportFix();
        setDimensionsPieCharts();
        animatePieCharts();
        animateMilestones();
        animateProgressBars();
        handleContactForm();
        handleBackToTop();
        showHidebackToTop();
        handleCvContact();
        languageChange();
    });

    $(window).scroll(function () {
        animateMilestones();
        animatePieCharts();
        animateProgressBars();
        showHidebackToTop();
    });
})(window.jQuery);
