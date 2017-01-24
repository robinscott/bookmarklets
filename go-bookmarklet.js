/*
HOW TO RELEASE.

1. Copy the content of the 'javascript:(function () {' below.
2. Convert ES6 to ES5 using https://babeljs.io/
3. Minify code using https://jscompress.com/
4. Turn code into bookmarklet using http://chriszarate.github.io/bookmarkleter/
5. Paste into URL input of new bookmark.

*/

javascript:(function () {

    var enhancedDropdown = document.querySelector('#pipelines .pipelines_selector .enhanced_dropdown');
    var scrollablePanel = document.getElementsByClassName('scrollable_panel')[0];
    var showPipelineButton = document.querySelector('#show_pipelines_selector');
    var applyPipelineButton = document.querySelector('#apply_pipelines_selector');

    var styles = ['.enhanced_dropdown .selector_group', '{padding: 10px 0 8px 5px !important;}', '.enhanced_dropdown .selector_pipeline', '{padding-left: 45px !important;}', '.enhanced_dropdown .selector-showHide', '{color: blue; display: inline-block;}', '.enhanced_dropdown .accordion-arrow', '{margin-right: 5px; cursor: pointer;}', '.enhanced_dropdown .accordion-arrow-open', '{margin-right: 5px; transform: rotate(90deg); cursor: pointer;}', '.enhanced_dropdown polyline', '{pointer-events: none}', '.enhanced_dropdown .no-arrow', '{margin-right: 5px}', '.enhanced_dropdown .no-arrow polyline', '{margin-right: 5px; stroke: none;}', '.enhanced_dropdown .accordion-spacer', '{margin-right: 5px; display: inline-block; width: 14.173px; height: 14.173px;}', '.enhanced_dropdown .selector_group input[type="checkbox"]', '{margin: 0 4px 4px; vertical-align: top;}'];

    var svgElemAttr = {
        'version': '1.1',
        'x': '0px',
        'y': '0px',
        'width': '14.173px',
        'height': '14.173px',
        'viewbox': '0 0 14.173 14.173'
    };

    var circleElemAttr = {
        'fill': 'none',
        'cx': '7.087',
        'cy': '7.087',
        'r': '7.087'
    };

    var polylineElemAttr = {
        'fill': 'none',
        'stroke': '#1F66BD',
        'points': '5.606 10.808 9.567 7.086 5.606 3.365',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-miterlimit': '10'
    };

    var addStyles = function addStyles() {
        var stylesFormatted = styles.toString().replace(/,/g, '');
        var styleElem = document.createElement('style');
        var textNode = document.createTextNode(stylesFormatted);

        styleElem.setAttribute('type', 'text/css');
        styleElem.appendChild(textNode);
        document.getElementsByTagName('head')[0].appendChild(styleElem);
    };

    var adjustModalSize = function adjustModalSize() {
        var refreshElems = {
            enhancedDropdown: document.querySelector('#pipelines .pipelines_selector .enhanced_dropdown'),
            scrollablePanel: document.querySelector('#pipelines .pipelines_selector .enhanced_dropdown .scrollable_panel'),
            viewportwidth: window.innerWidth,
            viewportheight: window.innerHeight
        };
        var scrollablePanelHeight = refreshElems.viewportheight - 200;
        var enhancedDropdownWidth = refreshElems.viewportwidth / 3;

        refreshElems.scrollablePanel.style.maxHeight = scrollablePanelHeight + 'px';
        refreshElems.enhancedDropdown.style.width = enhancedDropdownWidth + 'px';
        refreshElems.enhancedDropdown.style.minWidth = '35em';
    };

    var addOverideStyles = function addOverideStyles() {
        enhancedDropdown.style.maxHeight = 'initial';
        enhancedDropdown.style.maxWidth = 'initial';
    };

    var styleEnhancedDropdown = function styleEnhancedDropdown() {
        var enhancedDropdown = document.querySelector('#pipelines .pipelines_selector .enhanced_dropdown');
        var selectorPipeline = document.querySelectorAll('.enhanced_dropdown .selector_pipeline');
        var enhancedDropdownDataAttr = enhancedDropdown.getAttribute('data-customised');

        if (enhancedDropdownDataAttr == 'false' || enhancedDropdownDataAttr == null) {
            enhancedDropdown.style.left = 'initial';
            enhancedDropdown.style.right = '15px';

            selectorPipeline.forEach(function (elem) {
                elem.style.display = 'none';
            });
            sortSelectorGroups();
            insertSvg();
            enhancedDropdown.setAttribute('data-customised', 'true');
        }
    };

    var insertSvg = function insertSvg() {
        var selectorGroup = scrollablePanel.querySelectorAll('.selector_group'),
            spacerElem = document.createElement('span'),
            xmlns = "http://www.w3.org/2000/svg",
            svgElem = document.createElementNS(xmlns, 'svg'),
            circleElem = document.createElementNS(xmlns, 'circle'),
            polylineElem = document.createElementNS(xmlns, 'polyline'),
            inputElem = void 0,
            selectorPipelines = 0;

        spacerElem.setAttribute('class', 'accordion-spacer');
        setAttributes(svgElem, svgElemAttr);
        setAttributes(circleElem, circleElemAttr);
        setAttributes(polylineElem, polylineElemAttr);
        svgElem.appendChild(polylineElem);

        selectorGroup.forEach(function (elem) {
            inputElem = elem.getElementsByTagName('input')[0];
            selectorPipelines = elem.querySelectorAll('.selector_pipeline');

            if (selectorPipelines.length > 0) {
                svgElem.setAttribute('class', 'accordion-arrow');
                elem.insertBefore(svgElem.cloneNode(true), inputElem);
            } else {
                elem.insertBefore(spacerElem.cloneNode(true), inputElem);
            }
            selectorPipelines = 0;
        });
    };

    var sortSelectorGroups = function sortSelectorGroups() {
        var group = Array.from(scrollablePanel.children);

        group.sort(function (a, b) {
            return a.innerHTML == b.innerHTML ? 0 : a.innerHTML > b.innerHTML ? 1 : -1;
        });
        for (var i = 0; i < group.length; ++i) {
            scrollablePanel.appendChild(group[i]);
        }
    };

    var findNodesForToggle = function findNodesForToggle(targetElem) {
        var pipelineDivElems = void 0;
        var nodesForToggle = [];

        if (event.target.tagName === 'svg') {
            pipelineDivElems = targetElem.parentNode.childNodes;

            for (var i = 0; i < pipelineDivElems.length; i++) {
                if (pipelineDivElems[i].className === 'selector_pipeline') {
                    nodesForToggle.push(pipelineDivElems[i]);
                }
            }
            toggleArrow(event.target);
        }

        return nodesForToggle;
    };

    var bindEvents = function bindEvents() {
        showPipelineButton.addEventListener('click', styleEnhancedDropdown, false);
        applyPipelineButton.addEventListener('click', removeCustomisedFlag, false);
        scrollablePanel.addEventListener('click', function (event) {

            var nodesForToggle = findNodesForToggle(event.target);
            if (nodesForToggle.length > 0) {
                toggle(nodesForToggle);
            }
        });
    };

    var removeCustomisedFlag = function removeCustomisedFlag() {
        var enhancedDropdown = document.querySelector('#pipelines .pipelines_selector .enhanced_dropdown');
        var enhancedDropdownDataAttr = enhancedDropdown.getAttribute('data-customised');

        if (enhancedDropdownDataAttr == 'true' || enhancedDropdownDataAttr == null) {
            enhancedDropdown.setAttribute('data-customised', 'false');
        }
    };

    var toggleArrow = function toggleArrow(svgElem) {
        if (hasClass(svgElem, 'accordion-arrow')) {
            svgElem.setAttribute('class', 'accordion-arrow-open');
        } else {
            svgElem.setAttribute('class', 'accordion-arrow');
        }
    };

    var toggle = function toggle(elements, specifiedDisplay) {
        var element = void 0,
            index = void 0;

        elements = elements.length ? elements : [elements];
        for (index = 0; index < elements.length; index++) {
            element = elements[index];

            if (isElementHidden(element)) {
                element.style.display = '';

                if (isElementHidden(element)) {
                    element.style.display = specifiedDisplay || 'block';
                }
            } else {
                element.style.display = 'none';
            }
        }
        function isElementHidden(element) {
            return window.getComputedStyle(element, null).getPropertyValue('display') === 'none';
        }
    };

    var setAttributes = function setAttributes(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    };

    var hasClass = function hasClass(el, name) {
        return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.getAttribute("class"));
    };

    var init = function init() {
        addOverideStyles();
        adjustModalSize();
        addStyles();
        bindEvents();

        window.onresize = adjustModalSize;
    };

    init();

})();
