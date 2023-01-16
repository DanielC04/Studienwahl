function RankingUnion(selectedIndikIdsCommaSeparated, maxIndikatoren, favoriten, profil) {
    var $ = window.jQuery;

    var _self = this;

    this.tableDataBaseUrl;
    this.indikatorXmlUrl;
    this.fbBaseUrl;
    this.order;
    this.scopeName;
    this.pageTitle;
    this.currentSubfachId;
    this.currentSubfach;
    this.currentFach;
    this.currentAbschluss;
    this.currentHstyp;
    this.informatikOverlay;
    this.favs = favoriten;
    this.profil = profil;

    this.selectedIndikIds = selectedIndikIdsCommaSeparated.split(",");


    /**
     * Aktuellen Ranking-View anzeigen
     */
    this.showRankingView = function () {
        var indikQuery = this.getSelectedIndikIdsAsQueryString();
        var orderQuery = this.getOrderAsQueryString();
        var favsQuery = this.getFavsAsQueryString();
        var profilQuery = this.getProfilAsQueryString();
        // var subfachId = this.getCurrentSubfachId();

        this.fetchTableData(
            this.tableDataBaseUrl + indikQuery + orderQuery + favsQuery + profilQuery
        );
        this.addRankingParamsToLocation(indikQuery + favsQuery + profilQuery + orderQuery);

        var containsForschungprofil = 0;
        for (var k = 0; k < this.selectedIndikIds.length; k++) {
            if (this.selectedIndikIds[k] === 613) {
                $(".fspLegend").show();
                containsForschungprofil = 1;
            }
        }
        if (containsForschungprofil === 0) {
            $(".fspLegend").hide();
        }

    };

    /**
     * Ranking params als Hash an die Url hängen
     */
    this.addRankingParamsToLocation = function (params) {
        window.location.hash = params;
    };

    /**
     * Tabellarische Ansicht laden
     */
    this.fetchTableData = function (url) {
        this.showLoadIcon();
        var caller = this;

        // Load data from the server and place the returned HTML into the matched element.
        $("#rankingTableArea").load(url, function () {
            caller.hideLoadIcon();

            if (_self.showNumbers) {
                $('.chevalue').show();
            }
            if (_self.currentSubfach && _self.scopeName) {
                var  {
                    subfachName, subfachKurz, fachId, fachUrl
                } = _self.currentSubfach;
                _self.changeSubfach(subfachName, subfachKurz, fachId, fachUrl, _self.scopeName);
            }
            if (_self.profil) {
                $('#profilSelect').val(_self.profil);
                _self.changeProfil(_self.profil);
            }

            window.Opentip.findElements();
        });
    };

    /**
     * Tabellen-Ansicht anzeigen
     */
    this.reorderTableView = function (newOrder) {
        this.order = newOrder;
        this.showRankingView();
    };

    /**
     * Baut aus den Favoriten einen QueryString auf
     */
    this.getFavsAsQueryString = function () {
        var queryParams = "";
        for (var k = 0; k < this.favs.length; k++) {
            queryParams += "&favs=" + this.favs[k];
        }
        return queryParams;
    };

    this.getProfilAsQueryString = function () {
        if (rankingUnion.profil) {
            return "&profil=" + rankingUnion.profil;
        } else {
            return "";
        }
    };

    /**
     * Baut aus den SelectedIndikIds einen QueryString auf
     */
    this.getSelectedIndikIdsAsQueryString = function () {
        var queryParams = "";
        for (var k = 0; k < this.selectedIndikIds.length; k++) {
            queryParams += "&left_f" + (k + 1) + "=" + this.selectedIndikIds[k];
        }
        return queryParams;
    };

    /**
     * Baut aus dem Order-Param einen QueryString auf
     */
    this.getOrderAsQueryString = function () {
        return "&order=" + this.order;
    };


    /**
     * Sichtbaren Zeilen einen alternierenden Background geben.
     */
    this.changeVisibleRowBackground = function () {
        $('table#cherankingtable tr:visible').each(function (index, element) {
            $(element).toggleClass("trbg0", index % 2 !== 0);
            $(element).toggleClass("trbg1", index % 2 === 0);
        });
    };


    /**
     * Stellt die Sichtbarkeit der Favoriten neu ein,
     * wenn sich Subfach oder Profil ändern.
     */
    this.handleFavVisibility = function () {
        // favs sichtbarkeit regeln
        var subfachFavCount = $('table#cherankingtable tr.fav:visible').size();
        var subfachFavs = [];
        $('table#cherankingtable tr.fav:visible').each(function () {
            var fbId = $(this).find('input.fbid').attr("data-fbid");
            if (fbId) {
                subfachFavs.push(fbId);
            }
        });
        rankingUnion.favs = subfachFavs;
        if (subfachFavCount > 1) {
            // vergleich zeigen
            $('table#cherankingtable #compareSeperatorRow').show();
            $('table#cherankingtable #favSeperatorRow').hide();
        } else if (subfachFavCount === 1) {
            $('table#cherankingtable #compareSeperatorRow').hide();
            $('table#cherankingtable #favSeperatorRow').show();
        } else if (subfachFavCount === 0) {
            $('table#cherankingtable #compareSeperatorRow').hide();
            $('table#cherankingtable #favSeperatorRow').hide();
            $('table#cherankingtable tr.favHeadlineRow').hide();
        }
        if (subfachFavCount > 0) {
            $('table#cherankingtable tr.favHeadlineRow').show();
        }
        if (subfachFavCount <= 1) {
            $('table#cherankingtable tr#infotext_over_ranking_table').show();
        }
    };

    /**
     * Versteckt Zeilen der ranking Tabelle die nicht zum gewählten Subfach gehören.
     */
    this.changeSubfach = function (subfachName, subfachNameKurz, fachId, fachInfoUrl) {

        this.currentSubfachId = fachId;
        if (subfachNameKurz) {
            $('#subfachLegende').hide();
            $('table#cherankingtable tr').not(".marker_header_row").hide();
            $('table#cherankingtable tr.fachgebiet_' + fachId).show();
            $('.chefachlink_in_headline').attr("href", fachInfoUrl);
            $('.subfachOrProfile').hide();
        } else {
            // show all
            $('#subfachLegende').show();
            $('table#cherankingtable tr').show();
            $('.subfachOrProfile').show();
            $('.chefachlink_in_headline').attr("href", fachInfoUrl);
        }

        this.handleFavVisibility();
        this.changeVisibleRowBackground();

        var indikQuery = this.getSelectedIndikIdsAsQueryString();
        var favsQuery = this.getFavsAsQueryString();
        var profilQuery = this.getProfilAsQueryString();
        var orderQuery = this.getOrderAsQueryString();
        var subfachId = this.getCurrentSubfachId();
        this.addRankingParamsToLocation(indikQuery + favsQuery + profilQuery + orderQuery + "&subfach=" + subfachId);

        $.get(checonfig.actionRoot + "ajax/rankingUnionView", {
            esb: this.currentFach,
            subfach: subfachId,
            ab: this.currentAbschluss,
            hstyp: this.currentHstyp
        }, null, 'text');
    };

    /**
     * Versteckt Zeilen der ranking Tabelle die nicht zum gewählten Profil gehören.
     */
    this.changeProfil = function (profilId) {
        rankingUnion.profil = profilId;
        if (profilId) {
            $('table#cherankingtable tr').not(".marker_header_row").hide();
            $('table#cherankingtable tr.profil_' + profilId).show();
            $('.subfachOrProfile').hide();
        } else {
            // hide all
            $('table#cherankingtable tr').not(".marker_header_row").hide();
            // find distinct urls and show the first entry for each url
            var distinctUrls = [];
            $('table#cherankingtable tr').each(function () {
                var url = $(this).find("a").attr("href");
                if ($.inArray(url, distinctUrls) < 0) {
                    distinctUrls.push(url);
                }
            });
            for (var i = 0; i < distinctUrls.length; i++) {
                var firstLink = $('table#cherankingtable tr a[href="' + distinctUrls[i] + '"]').first();
                $(firstLink).closest("tr").show();
            }
        }

        this.handleFavVisibility();
        this.changeVisibleRowBackground();
    };

    /**
     * Erzeugt eine Url auf den Fachbereich mit der Id bfId.
     */
    this.getFbDetailUrl = function (fbId) {
        var appendIx = fbId.indexOf("-");
        if (appendIx > 0) {
            fbId = fbId.substring(0, appendIx);
        }
        var url = this.fbBaseUrl + '&id=' + fbId;

        if (this.getCurrentSubfachId()) {
            url += "&subfach=" + this.getCurrentSubfachId();
        }
        return url;
    };

    this.showLoadIcon = function () {
        $('.kriterienloader').show();
    };
    this.hideLoadIcon = function () {
        $('.kriterienloader').hide();
    };

    this.getCurrentSubfachId = function () {
        return this.currentSubfachId;
    };

    /**
     * Wird durch die IndikatorenBox bei Änderung in der Auswahl aufgerufen.
     */
    this.updateRanking = function (selectedIndikIds) {
        _self.selectedIndikIds = selectedIndikIds;
        _self.showRankingView();
    };

    this.indikbox = new IndikatorenBox(this.selectedIndikIds, maxIndikatoren, this.updateRanking);

    this.loadIndikatoren = function () {
        _self.indikbox.loadIndikatoren(_self.indikatorXmlUrl);
    };

    this.indikatorClick = function () {
        _self.indikbox.indikatorCheckboxClick(this);
    };

    $(document).ready(function () {
        _self.showRankingView();
    });
}


function IndikatorenBox(selected, maxIndikatoren, updateCallbackFn) {
    var $ = window.jQuery;
    var _self = this;

    this.selected = selected;
    this.maxIndikatoren = maxIndikatoren;
    this.indikatorMap = null;
    this.liveUpdate = true;

    /**
     * Holt sich die Indikatoren
     */
    this.loadIndikatoren = function (url) {
        // var caller = this;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: _self.parseIndikatorenResult
        });
    };

    this.parseIndikatorenResult = function (xml) {

        var bausteineElement = $(xml).find("bausteine");
        var esb = bausteineElement.attr("esb");
        var hstyp = bausteineElement.attr("hstyp");

        var bausteine = $(xml).find("baustein");

        // Keys in richtige Reihenfolge bringen
        var sortedBausteine = [];
        bausteine.each(function (i) {
            var length = $(this).find("indikator").length;
            sortedBausteine.push([i, length]);
        });

        _self.indikatorMap = {};
        for (var k = 0; k < sortedBausteine.length; k++) {
            var sortedBaustein = sortedBausteine[k];
            _self.createIndikatoren(k, _self.indikatorMap, $(xml).find("baustein").eq(sortedBaustein[0]), esb, hstyp);
        }

        _self.processSelection();
    };

    /**
     * Indikatoren-Status anzeigen.
     */
    this.processSelection = function () {

        if (_self.liveUpdate) {
            updateCallbackFn(_self.selected);
        }

        // Numerierung und checkStatus anzeigen
        $('.indikatorIndexNumber').text("");
        for (var i = 0; i < _self.selected.length; i++) {
            $("input[name=" + _self.selected[i] + "].indikatorCheckbox").parent().parent().find('.indikatorIndexNumber').html((i + 1) + ".&nbsp;");
        }

        // Nicht mehr als X Indikatoren zulassen
        if (_self.selected.length >= _self.maxIndikatoren) {
            $('.indikatorCheckbox:not(:checked)').attr("disabled", true);
            $('.maxCriteriaWarn').show();
        } else if (_self.selected.length === 1) {
            // Nicht weniger als einen
            $('.indikatorCheckbox:checked').attr("disabled", true);
        } else {
            $('.indikatorCheckbox').removeAttr("disabled");
            $('.maxCriteriaWarn').hide();
        }

        // ausgewählte bold anzeigen
        $('.indikatorCheckbox:not(:checked)').parent().find('label').removeClass('active');
        $('.indikatorCheckbox:checked').parent().find('label').addClass('active');
    };

    this.addSelected = function (indikatorVorkId) {
        if (this.liveUpdate && _self.selected.length >= _self.maxIndikatoren) {
            var az = 1 + _self.selected.length - _self.maxIndikatoren;
            _self.selected.splice(0, az);
        }
        _self.selected.push(indikatorVorkId);
        _self.processSelection();
    };

    this.removeSelected = function (indikatorVorkId) {
        var pos = $.inArray(indikatorVorkId, _self.selected);
        if (pos !== -1) {
            _self.selected.splice(pos, 1);
        }
        _self.processSelection();
    };

    this.createBausteinHeadline = function (obj) {
        var bausteinHeadline = obj.attr('display_name');
        return $(document.createElement('p')).attr({'class': 'std-fontSize std-fontSize--medium  std-bold'}).text(bausteinHeadline);
    };


    this.createIndikatoren = function (id, indikMap, obj, esb, hstyp) {
        var indikatorBausteinBox = $(document.createElement('div')).attr({
            'id': 'indikatorBausteinBox_' + id,
            'class': 'indikatorBausteinBox'
        }).append(_self.createBausteinHeadline(obj));

        $(obj).find("indikator").each(function (i) {
            var indikator = $(this);
            var indikatorVorkId = indikator.attr('id');
            var indikatorId = indikator.attr('indikatorid');
            var indikatorName = indikator.attr('name');
            var isChecked = $.inArray(indikatorVorkId, _self.selected) !== -1;

            // store indikator
            indikMap[indikatorVorkId] = {"indikatorId": indikatorId, "name": indikatorName};

            // create html
            var indexNumber = $(document.createElement('div')).attr({'class': 'indikatorIndexNumber'});
            var checkbox = $(document.createElement('input')).attr({
                'name': indikatorVorkId,
                'type': 'checkbox',
                'id': 'indikator_id_' + indikatorVorkId,
                'class': 'indikatorCheckbox std-checkbox__control'
            })
                .on('change', _self.indikatorCheckboxClick);

            if (isChecked) {
                checkbox.attr("checked", "checked");
            }
            var info = $(document.createElement('a'))
                .attr({
                    'class': 'info choosecolorbox cheinfo indikatorInfoLink',
                    id: 'indikator_info_' + indikatorVorkId,
                    'infoid': indikatorVorkId,
                    'data-ot': true,
                    'data-ot-title': indikatorName,
                    'data-ot-ajax': checonfig.actionRoot + 'indikatorInfo?indikid=' + indikatorId + '&esb=' + esb + '&hstyp=' + hstyp,
                    'data-ot-show-on': 'click',
                    'data-ot-target': 'true',
                    'data-ot-hide-trigger': 'closeButton',
                    'rel': 'nofollow',
                    'title': '',
                    'href': 'javascript:void;'
                });
            var label = $(document.createElement('label')).html(indikatorName).attr({
                'for': 'indikator_id_' + indikatorVorkId,
                'class': 'indikatorLabel std-checkbox__label'
            }).prepend(indexNumber).append(info);
            var checkboxContent = $(document.createElement('div')).attr({'class': 'checkboxContent std-checkbox'}).append(checkbox, label);
            var indikatorRow = $(document.createElement('div')).attr({
                'id': 'indikator_row_' + indikatorVorkId,
                'class': 'indikator_row',
                'data-indik-name': indikatorName
            }).append(checkboxContent);

            // append to indikatorBausteinBox
            indikatorBausteinBox.append(indikatorRow);
        });

        $('#indikatorenListe').append(indikatorBausteinBox);
    };

    /**
     * Gibt den Indikator mit der übergebenen VorkommenId zurück.
     * Das Return-Objekt ist eine Map, die in #createIndikatoren aufgebaut wurde.
     */
    this.getIndikDataByVorkommenId = function (indikVorkommenId) {
        return _self.indikatorMap[indikVorkommenId];
    };


    this.errorInGet = function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
    };

    this.indikatorCheckboxClick = function (ev) {
        var $checkbox = $(ev.currentTarget);
        console.log('Click eleemtn: ', $checkbox);
        if ($checkbox.is(':checked') && (_self.selected.length < _self.maxIndikatoren)) {
            _self.addSelected($checkbox.attr("name"));
        } else if (_self.selected.length > 1) {
            _self.removeSelected($checkbox.attr("name"));
        }
    };
}

/**
 * Kümmert sich in der grafischen und in der tabellarischen Ansicht um die
 * Auswahl der Hochschulen für den Hochschul-Vergleich
 *
 * @param vergleichBaseUrl - BasisPfad zum HS Vergleich
 * @returns
 */
function FavoritenService(vergleichBaseUrl) {

    this.vergleichBaseUrl = vergleichBaseUrl;

    this.addFav = function (id) {
        if (rankingUnion.favs.length === 1 && rankingUnion.favs[0] == -1) {
            // Only element in favs array is -1 which indicates that all favs were removed previously.
            // Since an fav will be added we have to remove -1 from the array.
            rankingUnion.favs.splice(0, 1);
        }
        rankingUnion.favs.push(id);
    };

    this.removeFav = function (id) {
        for (var i = rankingUnion.favs.length - 1; i >= 0; i--) {
            if (rankingUnion.favs[i] == id) {
                rankingUnion.favs.splice(i, 1);
            }
        }
        if (rankingUnion.favs.length === 0) {
            rankingUnion.favs.push(-1);
        }
    };

    this.getFavCount = function () {
        return rankingUnion.favs.length;
    };

    this.clickOnTableEntry = function (event, element) {
        var input = jQuery(element);

        /*
         * wird zum positionieren der hs vergleichsbox benoetigt
         */
        this.currentEvent = event;
        var id = parseInt(input.attr("data-fbid"));
        var isRemove = false;
        if (input.is(":checked")) {
            this.addFav(id);
            if (!this._checkIfInView(jQuery("#rankingsupertitle"))) {
                this._showInfoBubble();
            }
        } else {
            this.removeFav(id);
            isRemove = true;
            this.hideInfoBubble();

        }

        input.parents('tr').animate({
            opacity: "0.0"
        }, 500, function () {

            if (!isRemove) {
                if (jQuery("#cherankingtable tr.fav").size() > 0) {
                    jQuery(this).insertAfter("#cherankingtable tr.fav:last");
                    jQuery(this).css("opacity", 1);
                } else {
                    jQuery(this).appendTo("#cherankingtable");
                }
            }
            // Animation complete.
            rankingUnion.showRankingView();
        });
    };

    //Prüft ob ein Element (zumindest teilweise) im viewport ist.
    this._checkIfInView = function (element) {
        var top = element.offset().top;
        var scrolltop = jQuery(window).scrollTop();

        var offset = top - scrolltop;

        if (offset > window.innerHeight || offset < -100) {
            return false;
        }
        return true;
    };


    this.toFavs = function () {
        CHE.hScrollToElement('#cherankingtable');
    };

    this.hideInfoBubble = function () {
        var infoBubble = jQuery('#rk2012_infobubble');
        infoBubble.fadeOut();
    };

    this._showInfoBubble = function () {
        var position = this.currentEvent;
        var top = position.pageY;
        top = top - 42;

        var left = position.pageX;
        left = left - 20;

        if (left < 170) {
            left = left + 170;
        } else {
            left = left - 170;
        }

        var infoBubble = jQuery('#rk2012_infobubble');
        infoBubble.css({
            top: top + 'px',
            left: left + 'px'
        }).fadeIn();
    };

    /**
     * Ruft den Hochschulvergleich auf
     */
    this.vergleich = function () {
        var subfachId = rankingUnion.getCurrentSubfachId();
        var url = this.vergleichBaseUrl + subfachId;
        for (var i = 0; i < rankingUnion.favs.length; i++) {
            var fav = rankingUnion.favs[i];
            url += "&fb" + i + "=" + fav;
        }

        this.hideInfoBubble();

        stdStyleguide.modal.loadInModal(null, url);
    };
}
