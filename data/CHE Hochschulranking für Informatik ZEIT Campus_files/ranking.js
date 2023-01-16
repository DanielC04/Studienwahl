var $ = window.jQuery;
var $window = $(window);
var $document = $(document);


$('.searchButton').click(function() {
    $('.searchButton').hide();
    $('.searchInput').show();
    $('.searchInput').focus();
});

$('.searchInput, .searchInputStart').keydown(function(event) {
    var key = event.which;
    if (key == 13) { // return
        window.location.href = checonfig.actionRoot + "suche?s=" + $(this).val();
    }
});

$('.searchButtonStart').click(function() {
     window.location.href = checonfig.actionRoot + "suche?s=" + $('.searchInputStart').val();
});

$('.searchInput').blur(function() {
    $('.searchInput').hide();
    $('.searchButton').show();
});


$(".toggle_text_link").click(function() {
    var $toggleLink = $(this);
    $toggleLink.prev(".toggle_text").slideToggle(300, function() {
        $toggleLink.children(".toggle_link_label:visible").fadeToggle(200, function() {
            $(this).siblings(".toggle_link_label").fadeToggle(200);
        });
    });
});

$document.ready(function() {
    // Tooltips
    function hideTooltips() {
        for (var i = 0; i < Opentip.tips.length; i++) {
            Opentip.tips[i].hide();
        }
    }

    //async autoload
    $('[data-async]').each(function(index, element) {
        var url = $(element).data('async');
        var refresh = $(element).is('[data-refresh]');

        $.get(url, function(data) {
            $(element).html(data).fadeIn('slow');

            if (refresh) {
                $(document).trigger('std:refresh');
            }
        });
    });

    //modal autoload
    $('[data-modal-autoload]').each(function(index, element) {
        stdStyleguide.modal.open($(element));
    });

    $window.one('scroll', function() {
        $('img[data-deferred-src]').each(function () {
            var $imgEl = $(this);
            var realSrc = $imgEl.attr('data-deferred-src');
            $imgEl.load(function() {
               $(this).addClass('deferred-loaded')
            });
            $imgEl.attr('src', realSrc);
        });
    });

});


function removeQueryStringParam(key) {
    var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
        urlQueryString = document.location.search,
        params = '';

    if (urlQueryString) {
        keyRegex = new RegExp('([\?&])' + key + '[^&]*');

        if (urlQueryString.match(keyRegex) !== null) {
            params = urlQueryString.replace(keyRegex, "$1");
        }
    }
    window.history.replaceState({}, "", baseUrl + params);
}

// custom modal
function showModal(title, content, error, hideClose) {
    var errorClass = error ? 'std-error' : '';

    var html = '<div class="std-modal" data-std-modal-container data-std-modal-container-auto>' +
        '<div class="std-modal__dialog">' +
        '<div class="std-modal__header std-row">';

    if (title) {
        html = html + '<div class="std-modal__headerContent std-headline std-headline--h4 std-headline--primary std-underline ' + errorClass + '">' + title + '</div>';
    }

    if (!hideClose) {
        html = html + '<span class="std-modal__headerClose" aria-hidden="true" data-std-modal-close>' +
            '<i class="std-icon std-icon--close std-icon--big std-icon--primary"></i>' +
            '</span>';
    }


    html = html + '</div>' +
        '<div class="std-modal__content std-row ' + errorClass + '">' +
        '<p class="std-row">' + content + '</p>' +
        '</div>' +
        '</div>' +
        '</div>';

    $modal = $(html);
    $('body').append($modal);
    stdStyleguide.modal.open($modal);
}

function CHECLASS() {
    this.graustufen = false;

    this.toggleGraustufen = function(lang, size) {
        if (this.graustufen) {
            this.showRankIcons('icons', lang, size);
        } else {
            this.showRankIcons('icons_pr', lang, size);
        }
        this.graustufen = !this.graustufen;

        $('.fspLegend').toggleClass('sw');
        $('.fspDiagramm').toggleClass('sw');
    };

    this.showRankIcons = function(folder, lang, size) {
        $('.r1').attr("src", checonfig.imageRoot + folder + "/kreis1.png");
        $('.r2').attr("src", checonfig.imageRoot + folder + "/kreis2.png");
        $('.r3').attr("src", checonfig.imageRoot + folder + "/kreis3.png");
        $('.r100').attr("src", checonfig.imageRoot + folder + "/kreis100.png");

        if (this.graustufen) {
            $('.legendg').attr("src", checonfig.imageRoot + lang + "/legende.gif");
        } else {
            $('.legendg').attr("src", checonfig.imageRoot + lang + "/legende_sw.gif");
        }
    };

    this.toggleGraustufenQr = function(lang, size) {
        if (this.graustufen) {
            this.showRankIconsQr('icons', lang, size);
        } else {
            this.showRankIconsQr('icons_pr', lang, size);
        }
        this.graustufen = !this.graustufen;
    };

    this.toggleNumbersRankingTable = function() {
        checonfig.showNumbers = !checonfig.showNumbers;
        if (checonfig.showNumbers) {
            $('.chevalue').css('display', 'block');
            $('#rankingTableViewNumbersButton').text(checonfig.rankingUnionViewNumbersButtonTextAusblenden);
            $('#tableSortOptions > span#showValues > a > span').text(checonfig.rankingUnionViewNumbersButtonTextAusblenden);
        } else {
            $('.chevalue').hide();
            $('#rankingTableViewNumbersButton').text(checonfig.rankingUnionViewNumbersButtonTextEinblenden);
            $('#tableSortOptions > span#showValues > a > span').text(checonfig.rankingUnionViewNumbersButtonTextEinblenden);
        }
        // aktualisiere session per ajax
        $.get(checonfig.actionRoot + "ajax/updateRankingViewNumbers", {
            displayNumbers: checonfig.showNumbers
        });
    };

    this.checkboxCheck = function() {
        var n = $(".only_five input:checked").length;
        if (n < 5) {
            $(".only_five input").removeAttr('disabled');
            $(".only_five .std-checkbox").removeClass('is-disabled');
        } else {
            $(".only_five input:checkbox:not(:checked)").attr('disabled', 'disabled');
            $(".only_five input:checkbox:not(:checked)").parent().addClass('is-disabled');
        }
    };

    this.ajaxSuche = function(query, page) {
        if (!page) {
            page = 1;
        }
        var findFachbereich = $('#suchForm input[name=findFachbereich]').prop('checked');
        var findStudiengang = $('#suchForm input[name=findStudiengang]').prop('checked');
        var url = checonfig.actionRoot + 'ajax/suche?ajaxSubmit=true&s=' + query +
            '&findFachbereich=' + findFachbereich +
            '&findStudiengang=' + findStudiengang +
            '&page=' + page;
        $('#ajaxSucheErgebnis').load(url);
    };
}

var CHE = new CHECLASS();

$(".profilSection .only_five input:checkbox").click(CHE.checkboxCheck);

// Suche
$("#suchForm").on('click', '#moreResults', function() {
    var $this = $(this);
    var page = $this.data('next-page') || 1;
    var query = $("#suchForm").data('query');

    var findFachbereich = $('#suchForm input[name=findFachbereich]').prop('checked');
    var findStudiengang = $('#suchForm input[name=findStudiengang]').prop('checked');
    var url = checonfig.actionRoot + 'ajax/suche?ajaxSubmit=true&s=' + query +
        '&findFachbereich=' + findFachbereich + '&findStudiengang=' +
        findStudiengang + '&page=' + page;

    $.get(url, function(data) {
        $('#moreResultsFooter').remove();
        $('#ajaxSucheErgebnis').append(data);
    });
});

/**
 * Handler für die SterneBewertung der Fachporträts
 *
 * @return function Function mit Eventlistenern
 */
this['ArticleRatingHandler'] = function() {
    window.ratyPlugin($);
    var $raty = $('#rateit');
    var fachId = $raty.attr('data-fach-id');
    var rateUrl = $raty.attr('data-rate-url');
    var lang = $raty.attr('data-lang');
    var loggedIn = $raty.attr('data-logged-in') == 'true';
    var sum = parseInt($raty.attr('data-rating-sum'));
    var count = $raty.attr('data-rating-count');

    // Modal messages set as attributes
    var modalHeader = $raty.attr('data-modal-header');
    var modalHeaderSuccess = $raty.attr('data-modal-header-success');
    var modalContentSuccess = $raty.attr('data-modal-content-success');
    var modalContentAlready = $raty.attr('data-modal-content-already-voted');
    var modalContentUnauth = $raty.attr('data-modal-content-unauth');

    function decRound(val) {
      return Math.round(val * 10) / 10;
    }

    var score = decRound(sum / count);

    function doRating(value) {
      $raty.raty('readOnly', true);
      $.ajax({
          url: rateUrl,
          data: {
              id: fachId,
              rating: value,
              esb: fachId,
              lang: lang
          },
          type: 'post',
          success: function(data) {
              var tomorrow = new Date();
              tomorrow = new Date(tomorrow.getTime() + 1000 * 60 * 60 * 24);
              var cookieVal = "fachinfo_" + fachId + "=" + value + "; expires=" + tomorrow.toGMTString() + ";";
              document.cookie = cookieVal;

              var $votesItem = $('span[itemprop="votes"]');
              // update output
              count ++;
              sum += value;
              var rating = decRound(sum / count);
              $('span[itemprop="votes"]').html(count);
              $('span[itemprop="rating"]').html(rating);
              $raty.raty('score', rating);
              showModal(modalHeaderSuccess, modalContentSuccess, false);
          }
      });
    }
    $document.ready(function() {
        var cookie = document.cookie;
        var alreadyVoted = cookie.indexOf("fachinfo_" + fachId + "=") !== -1;

        $raty.raty({
            cancel: false,
            click: function(value) {
              if (!loggedIn) {
                showModal(modalHeader, modalContentUnauth, false);
              } else if (alreadyVoted) {
                showModal(modalHeader, modalContentAlready, false);
              } else {
                doRating(value);
              }

            },
            hints: ['', '', '', '', ''],
            noRatedMsg: '',
            number: 5,
            numberMax: 5,
            precision: false,
            readOnly: false,
            round: {
                down: 0.49,
                full: 0.5,
                up: 0.5
            },
            score: score,
            starHalf: '',
            starOff: 'std-icon std-icon--emptyStar',
            starOn: 'std-icon std-icon--filledStar'
        });
    });

};

/**
 * Handler für die Diagramme auf den Detailseiten.
 *
 * @return function Function mit Eventlistenern
 */
this["DetailDiagramHandler"] = function() {

    $('.diagram-wrapper').each(function() {
        var $el = $(this);
        var indikator = $el.data('indikator');

        var reqData = {
            indikId: indikator,
            entityId: $el.data('entity')
        };

        var responseHandler  = function(data, aux) {
          console.log("Aux",aux);
          var diagr;
          if (aux['diagram-type'] === 'FORSCH_PROF') {
            diagr = new ForschungsProfil($el, data);
            if (diagr.isValid()) {
              diagr.drawLegend();
              diagr.drawChart();
            } else {
              $el.parent().remove();
            }
          } else if (aux['diagram-type'] === 'STUDG_PROF') {
            diagr = new StudiengangsProfil($el, data, aux);
            if (diagr.isValid()) {
              diagr.drawChart();
              $window.on('resize', diagr.drawChart);
            } else {
              var $indikCon = $el.parent().parent();
              $indikCon.prev().remove();
              $indikCon.remove();
            }
          }
        };

        $.ajax({
            url: checonfig.actionRoot + "diagramm/data",
            data: reqData,
            success: function(response) {
                // Hier wird das native JSON.parse() benutzt, weil es besser mit
                // den Umlauten klar kommt als jQuery.
                var respJson = JSON.parse(response);
                if (respJson.data) {
                    responseHandler(respJson.data, respJson.aux);
                }
            }
        });
    });

    /**
     * Forschungsprfoil Diagramme findet man auf den Fachbereichsdetailseiten
     * z.B. für die Fachbereiche der Physik
     *
     * @param {jQuery Object} $el Target Conatiner
     * @param {JSON} _data Diagramm -Daten
     */
    function ForschungsProfil($el, _data) {
        var data = _data;

         this.isValid = function() {
          var valid = false;
          for (var i = 0; i < data.length; i++) {
              // Data als valide ansehen, wenn wenigstens ein Eintrag label und value.
              if (data[i].label && data[i].value) {
                return true;
              }
          }
        };


        $el.addClass('std-grid');
        var $legend = $('<div class="legend std-grid__cell std-grid__cell--small-6of12 std-grid__cell--tiny-12of12 std-grid__cell--medium-10of12 std-fontSize std-fontSize--small std-color std-color--gray"></div>').appendTo($el);
        $legend.append('<div class="std-grid std-grid--gutters std-grid--1of2"></div>');
        var $diagram = $('<div class="diagram fb-profil std-grid__cell std-grid__cell--small-6of12 std-grid__cell--medium-2of12 std-grid__cell--tiny-12of12"></div>').appendTo($el);

        var color = d3.scale.ordinal().range(checonfig.chartColors);

        function legendColorSquare(label) {
            return '<div class="legendColor" style="background: ' + color(label) + '"></div>';
        }

        this.drawLegend = function() {
            $container = $legend.children().first();

            $.each(data, function(idx, d) {
                $container.append('<div class="std-grid__cell">' +
                    legendColorSquare(d.label) + d.label + '</div>'
                );
            });
        };

        this.drawChart = function() {

            var width = Math.min($diagram.width(), 200);
            var height = width;
            var donutWidth = Math.round(12 * (width / 100));
            var radius = (width / 2) - 5;

            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius - donutWidth);

            var pie = d3.layout.pie()
                .value(function(d) {
                    return d.value;
                })
                .sort(null);

            var svg = d3.select($diagram.get(0)).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .attr("fill", function(d, i) {
                    return color(d.data.label);
                })
                .on("mouseover", function(d) {
                    d3.select(this)
                        .attr("stroke", "white")
                        .transition()
                        .duration(1000)
                        .attr("stroke-width", 3);
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .transition()
                        .attr("stroke", "none");
                })
                .each(function(d, i) {
                    var $segment = $(this);
                    var tip = new Opentip($(this), d.data.value + '%', legendColorSquare(d.data.label) + d.data.label, { showOn: ["mouseover", "click"]});
                    console.log(tip);
                    $segment.on("mouseover touchstart", function() {
                        for(var i = 0; i < Opentip.tips.length; i ++) {
                            Opentip.tips[i].hide();
                        }
                        tip.show();
                    });
                    $segment.on("mouseout", function() {
                       tip.hide();
                    })
                });
        };

    }

    function StudiengangsProfil($el, data, aux) {

        var categories = data.map(function(entry) {
            return entry.label;
        });
        var values = data.map(function(entry) {
            if (!entry.value[0]) {
                entry.value[0] = 0;
            }
            if (!entry.value[1]) {
                entry.value[1] = 0;
            }
            return entry.value;
        });
        var valueLegende = [aux.label_legende_min, aux.label_legende_max];
        var valueColors = ['#41AA78', '#1cdcb5'];

        this.isValid = function() {
           var valid = false;
           for (var i = 0; i < data.length; i++) {
               // Data als valide ansehen, wenn wenigstens ein Eintrag label und
               // einen value mit wenigstens einem max oder min eintrag.
               if (data[i].label && data[i].value) {
                 var value = data[i].value;
                 if (value.length == 2) {
                   if (value[0] > 0 || value[1] > 1) {
                     return true;
                   }
                 }
               }
           }
         };


        function drawLegend(mobileView) {
            var $legend = $('<div class="legend"></div>').appendTo($el);
            $legend.addClass(mobileView ? 'top-right' : 'bottom-right');
            $legend.append('<div class="std-grid std-grid--gutters std-grid--1of2" ></div>');

            $container = $legend.children().first();

            $.each(valueLegende, function(i, d) {
                $container.append('<div class="std-grid__cell" style="padding:0;">' +
                    '<div class="legendColor sg-profil-color-' + i + '" ></div>' +
                    d + '</div>'
                );
            });
        }

        function drawSlimChart() {
            var $diagram = $('<div class="diagram"></div>').appendTo($el);

            var categoryHtml = '<div class="sg-profil-category">' +
                '<span class="sg-profil-category-label"></span>' +
                '<div class="sg-profil-value-container">' +
                '<div class="sg-profil-valuebar max">' +
                '</div>' +
                '<div class="sg-profil-valuebar min">' +
                '</div>' +
                '</div>' +
                '</div>';
            categories.forEach(function(category, i) {
                var $categCon = $(categoryHtml).appendTo($diagram);

                if (i === 0) {
                    $categCon.addClass('first');
                }

                $categCon.find('.sg-profil-category-label').text(category);

                var reversed = [values[i][1], values[i][0]];
                reversed.forEach(function(value, j) {
                    var $valueBar = $categCon.find('.sg-profil-valuebar:eq(' + j + ')');
                    if (value) {
                        $valueBar.animate({
                            width: (value) + '%'
                        }, 800 + (j * 200), function() {
                            $(this).text(value);
                        });
                    } else {
                        $valueBar.hide();
                    }
                });
            });
        }

        function drawWideChart(totalW) {
            var n = categories.length;
            var w = 0.75 * totalW;
            var legendW = totalW - w;
            var h = n * 16 + (n - 1) * 24;
            var totalH = h + 40;


            var grid = d3.range(11).map(function(i) {
                return {
                    'x1': 0,
                    'y1': 0,
                    'x2': 0,
                    'y2': h
                };
            });

            var xscale = d3.scale.linear()
                .domain([0, 100])
                .range([0, w]);

            var yscale = d3.scale.linear()
                .domain([0, categories.length])
                .range([0, h]);

            var canvas = d3.select($el.get(0))
                .append('svg')
                .attr({
                    'width': totalW,
                    'height': totalH
                });


            var tickVals = grid.map(function(d, i) {
                return i * 10;
            });
            var xAxis = d3.svg.axis();
            xAxis
                .orient('bottom')
                .scale(xscale)
                .tickSize(1)
                .tickValues(tickVals);

            var yAxis = d3.svg.axis();
            yAxis
                .orient('left')
                .scale(yscale)
                .tickFormat(function() {
                    return '';
                })
                .tickValues(d3.range(11));


            var y_xis = canvas.append('g')
                .attr("transform", "translate(" + legendW + ",20)")
                .attr('class', 'axis')
                .call(yAxis);

            y_xis.selectAll('text')
                .html("")
                .attr("x", -legendW)
                .attr("y", 10)
                .append('tspan').text(function(d, i) {
                    return categories[i];
                }).each(wrap)
                .style('text-anchor', 'start');

            function wrap() {
                var self = d3.select(this),
                    textLength = self.node().getComputedTextLength(),
                    text = self.text();
                while (textLength > legendW && text.length > 0) {
                    text = text.slice(0, -1);
                    self.text(text + '...');
                    textLength = self.node().getComputedTextLength();
                }
            }


            var bars = canvas.append('g')
                .attr("transform", "translate(" + legendW + ",21)")
                .attr('class', 'bars')
                .selectAll('rect')
                .data(values)
                .enter();

            bars.append('rect')
                .attr('height', 16)
                .attr('class', 'max')
                .attr({
                    'x': 0,
                    'y': function(d, i) {
                        return yscale(i);
                    }
                })
                .attr('width', 0)
                .transition()
                .duration(800)
                .attr("width", function(d) {
                    return xscale(d[1]);
                });

            bars.append('rect')
                .attr('height', 16)
                .attr('class', 'min')
                .attr({
                    'x': 0,
                    'y': function(d, i) {
                        return yscale(i);
                    }
                })
                .attr('width', 0)
                .transition()
                .duration(1000)
                .attr("width", function(d) {
                    return xscale(d[0]);
                });

            bars.append('rect')
                .attr('height', 16)
                .attr({
                    'x': -3,
                    'y': function(d, i) {
                        return yscale(i);
                    }
                })
                .attr("width", function(d) {
                    return xscale(d[0]) + xscale(d[1]) + 3;
                })
                .attr("stroke", "white")
                .attr("stroke-width", 3)
                .style('fill', 'transparent').on("mouseover", function(d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("stroke", "none");
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .attr("stroke", "white")
                        .transition()
                        .attr("stroke-width", 3);

                })
                .each(function(d, i) {
                    new Opentip($(this), '<span>' + valueLegende[0] + ':\t' + d[0] + ' cp </span><br><span>' + valueLegende[1] + ':\t' + d[1] + ' cp </span>', categories[i]);
                });

            var grids = canvas.append('g')
                .attr('class', 'grid')
                .attr('transform', 'translate(' + (legendW - 1) + ',10)')
                .selectAll('line')
                .data(grid)
                .enter()
                .append('line')
                .attr({
                    'x1': function(d, i) {
                        return i * (w / 10);
                    },
                    'y1': function(d) {
                        return d.y1 + 12;
                    },
                    'x2': function(d, i) {
                        return i * (w / 10);
                    },
                    'y2': function(d) {
                        return d.y2 - 10;
                    },
                })
                .filter(function(d, i) {
                    return i > 0;
                })
                .style('stroke-dasharray', '1,1');

            var x_xis = canvas.append('g')
                .attr("transform", "translate(" + (legendW - 1) + "," + (h + 1) + ")")
                .attr('class', 'axis x')
                .call(xAxis);
            x_xis.selectAll('text')
                .filter(function(d, i) {
                    return i == 10;
                })
                .style('text-anchor', 'end');
        }

        this.drawChart = function() {
            $el.html('');

            var totalW = $el.width();
            var mobileView = totalW < 600;

            if (mobileView) {
                drawSlimChart();
            } else {
                drawWideChart(totalW);
            }
            drawLegend(mobileView);

        };


    }

};


this["PlacesEntryHandler"] = function() {
    var $abcLinks = $('.abcLink');


    function mapInit() {
        HsrMaps.initializeMap({
            lat: 50.70121286130409,
            lng: 10.107421875,
            containerId: 'map',
            markerContainerId: 'markers',
            zoom: 5
        });
    }

    function letterSelect(letter) {
        $('.abcKey').hide();
        $('#abcKey_' + letter).show();
    }

    var carousel;

    $abcLinks.click(function() {
        var $clicked = $(this);
        $abcLinks.removeClass('active');
        letterSelect($clicked.attr('data-letter'));

        if (carousel) {
            carousel.goToSlide($clicked.attr('data-slide-index') - 1);
        }
        $clicked.addClass('active');
    });

    function initAbcCarousel() {
        var $carouselWrapper = $('.abcCarousel');

        function onSlideChange($firstSlide, next) {
            var $currentSlide = $firstSlide.next();
            $('.abcLink').removeClass('active');
            var active = $currentSlide.attr('data-active-slide')  == 'true';
            if (active) {
              letterSelect($currentSlide.attr('data-letter'));
            } else {

              if(next) {
                setTimeout(carousel.goToNextSlide, 250);
              } else {
                setTimeout(carousel.goToPrevSlide, 250);
              }
            }
            console.log("Active: ", active);
            $currentSlide.find('.abcLink').addClass('active');
        }
        carousel = $carouselWrapper.find('ul.std-carousel').bxSlider({
            "mode": "horizontal",
            pager: false,
            "minSlides": 3,
            "maxSlides": 5,
            "moveSlides": 1,
            "slideWidth": 48,
            swipeThreshold: 5,
            startSlide: 25,
            controls: false,
            speed: 10,
            onSlideNext: function(firstSlide) {
              onSlideChange(firstSlide, true);
            },
            onSlidePrev: function(firstSlide) {
              onSlideChange(firstSlide, false);
            }
        });

        $carouselWrapper.find('[data-std-carousel-nav]').on('click', function(e) {
            e.preventDefault();
            if (carousel) {
                var direction = $(this).attr('data-std-carousel-nav');
                if (direction === 'prev') {
                    carousel.goToPrevSlide();
                } else if (direction === 'next') {
                    carousel.goToNextSlide();
                }
            }

        });
    }

    $window.one('scroll',function() {
        mapInit();
        initAbcCarousel();
    });
};

// Variable ist true wenn Listener auf doc und window bereits gesetzt wurden
var outsideListenerSet = false;
this["RankingTableHandler"] = function() {

    $document.ready(function() {
        if (!outsideListenerSet ) {
          bindCriteriaToggle();
          outsideListenerSet = true;
        }

    });

    function bindCriteriaToggle() {
        $('.criteria-toggle').click(function() {
            console.log("Click auf Toggle!")
            var indikCon = $('.indikatorSlide');

            if (indikCon.hasClass('menu-visible')) {
                indikCon.find('.slideOverlay').fadeOut(200);
                indikCon.removeClass('menu-visible');
            } else {
                indikCon.find('.slideOverlay').fadeIn(200);
                indikCon.addClass('menu-visible');
            }
        });
    }

};

this['Cockpit'] = function() {


    var $fachSelect = $('[data-hsr-fach-select]');
    var $scopeSelect = $('[data-hsr-scope-select]');
    var $errorNotification = $('[data-hsr-cockpit-error]');
    var $goBtn = $('[data-hsr-cockpit-go]');

    var rankscope = JSON.parse($('[data-hsr-cockpit-rankscope]').text());

    var data = JSON.parse($('[data-hsr-cockpit-data]').text());

    var resetFachLabel = $fachSelect.attr('data-hsr-select-reset');
    var noFachValLabel = $fachSelect.attr('data-hsr-select-placeholder');

    var noScopeValLabel = $scopeSelect.attr('data-hsr-select-placeholder');
    var resetScopeLabel = $scopeSelect.attr('data-hsr-select-reset');
    init(data, rankscope);
    function init(data, rankscope) {

        var availableScopes = [];
        var fachIds = Object.keys(data);
        fachIds.forEach(id => {
            data[id].forEach(scope => {
                var foundIdx = availableScopes.findIndex(s => s.id === scope.id);
                if(foundIdx === -1) {
                    var scopeMapEntry = Object.assign({}, scope, { fachIds: [ id ]});
                    availableScopes.push(scopeMapEntry);
                } else {
                    availableScopes[foundIdx].fachIds.push(id);
                }
            });
        });

        $fachSelect.change(function () {
            $fachSelect.removeClass('is-invalid');
            $scopeSelect.removeClass('is-invalid');
            $errorNotification.hide();

            var fachid = $fachSelect.find('option:selected').first().val();
            var scopeId = $scopeSelect.find('option:selected').first().val();

            showScopesForFachInCockpit(fachid, scopeId);
        });

        $scopeSelect.change(scopeSelectChanged);

        function scopeSelectChanged() {
            $fachSelect.removeClass('is-invalid');
            $scopeSelect.removeClass('is-invalid');
            $errorNotification.hide();

            var scopeId = $scopeSelect.find('option:selected').first().val();
            var $fachSelectOptions = $fachSelect.find('option');
            if (scopeId) {
                var foundScope = availableScopes.find(sc => sc.id === scopeId);

                if (foundScope) {
                    $fachSelectOptions.attr('disabled', 'true');
                    var relatedIds = foundScope.fachIds;
                    relatedIds.forEach(fachId => {
                        $fachSelectOptions.filter('[value="' + fachId + '"]').attr('disabled', null);
                    });
                    $fachSelectOptions.filter('[value=""]').attr('disabled', null);
                } else {
                    $fachSelectOptions.show();
                }

                $scopeSelect.find('option').first().html('<i>' + resetScopeLabel + '</i>');
            } else {
                $fachSelectOptions.attr('disabled', null);
                $fachSelect.find('option:selected').prop("selected", false);
                $fachSelect.find('option').first().text(noFachValLabel);
                $scopeSelect.find('option').first().text(noScopeValLabel);
            }
        }

        function showScopesForFachInCockpit(fachid, scopeid) {
            if (fachid) {
                var scopes = data[fachid];
                if (scopes) {
                    $scopeSelect.empty();
                    if (scopeid || scopes.length === 1) {
                        $scopeSelect.append('<option value="" ><i>' + resetScopeLabel + '</i></option>');
                    } else {
                        $scopeSelect.append('<option value="" >' + noScopeValLabel + '</option>');
                    }

                    scopes.forEach(scope => {
                        $scopeSelect.append('<option ' + (scopes.length === 1 || scope.id === scopeid ? 'selected ' : '') +
                            'value="' + scope.id + '" >' +
                            scope.name + '</option>');
                    });
                }
                $fachSelect.find('option').first().html('<i>' + resetFachLabel + '</i>');
            } else {
                $scopeSelect.empty();
                $scopeSelect.append('<option value="" >' + noScopeValLabel + '</option>');
                availableScopes.forEach(scope => {
                    $scopeSelect.append('<option value="' + scope.id + '" >' +
                        scope.name + '</option>');
                });
                scopeSelectChanged();
                $fachSelect.find('option').first().text(noFachValLabel);
            }
        }

        $goBtn.click(function() {
            var fachid = $fachSelect.find('option:selected').first().val();
            if (!fachid) {
                $fachSelect.addClass('is-invalid');
                $errorNotification.show();
                return;
            }

            var scopeId = $scopeSelect.find('option:selected').first().val();
            if (scopeId === '') {
                $scopeSelect.addClass('is-invalid');
                $errorNotification.show();
                return;
            }

            if (fachid && scopeId) {
                var scopes = data[fachid];
                if (scopes) {
                    var foundScope = scopes.find(scope => scope.id === scopeId);
                    if (foundScope) {
                        window.location.href = foundScope.url;
                    }
                }
            }
        });

        // TODO ready logik auskommentiert wg. Problemen mit Sonderfällen.
        // $document.ready(function () {
        //     if (rankscope) {
        //         var { fachId, subfachId, hochschultyp, abschlussart} = rankscope;
        //         hochschultyp = hochschultyp ? hochschultyp : null;
        //         if (subfachId) {
        //             $fachSelect.find('option[value="' + subfachId + '"]').prop("selected", true);
        //             if (!hochschultyp && !abschlussart) {
        //                 showScopesForFachInCockpit(subfachId, null);
        //             } else {
        //                 showScopesForFachInCockpit(subfachId, `${hochschultyp}-${abschlussart}`);
        //             }
        //         } else {
        //             $fachSelect.find('option[value="' + fachId + '"]').prop("selected", true);
        //             if (!hochschultyp && !abschlussart) {
        //                 showScopesForFachInCockpit(fachId, null);
        //             } else if ( fachId === "16") {
        //                 // Sonderfall Verfahrenstechnik FH
        //                 $fachSelect.find('option[value="110"]').prop("selected", true);
        //                 showScopesForFachInCockpit("103", `${hochschultyp}-${abschlussart}`);
        //             } else {
        //                 showScopesForFachInCockpit(fachId, `${hochschultyp}-${abschlussart}`);
        //             }
        //         }
        //
        //         if (hochschultyp || abschlussart ) {
        //             scopeSelectChanged();
        //         }
        //     }
        // });
        showScopesForFachInCockpit(null, null);
    }


};

this['callHandler'] = function(fnName) {
    this[fnName].call();
};

var callList = window.hsrCallList;
callList.forEach(function(fnName) {
    console.log('Calling: ', fnName);
    this[fnName].call();
});
window.hsrEnv = this;
