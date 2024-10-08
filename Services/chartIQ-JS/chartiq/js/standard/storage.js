/**!
 *	9.4.0
 *	Generation date: 2024-08-28T15:51:29.272Z
 *	Client name: codeit
 *	Package Type: Core alacarte
 *	License type: annual
 *	Build descriptor: a9931b733
 */

/***********************************************************!
 * Copyright © 2024 S&P Global All rights reserved
*************************************************************/
/*************************************! DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! !*************************************
* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting *
* and load that file right after the library has been loaded, but before the chart engine is instantiated.              *
* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          *
*************************************************************************************************************************/
/* eslint-disable no-extra-parens */


import { CIQ as _CIQ } from "../../js/chartiq.js";


let __js_standard_storage_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * <span class="quotefeed">QuoteFeed required</span> if `params.noDataLoad` is set to `false`
 *
 * Imports a layout (panels, studies, candleWidth, etc) from a previous serialization. See {@link CIQ.ChartEngine#exportLayout}.
 *
 * There are three ways to use this method:
 * 1. Preset the layout object in the chart instance, but do not load any data.
 *    - This is usually used to restore an initial 'symbol independent' general layout (chart type and studies mainly) that will then take effect when `loadChart` is subsequently called.
 *    - In this case, exportedLayout should be called using 'withSymbols=false' and the importLayout should have 'noDataLoad=true'.
 * 2. Load an entire new chart and its data, including primary symbol, additional series, studies, chart type, periodicity and range:
 *    - In this case, you should not need call loadChart, setPeriodicity setSpan or setRange, addStudy, etc. since it is all restored from the previously exported layout and loaded using the attached quoteFeed.
 *    - If you still wish to change periodicity, span or range, you must use the CB function to do so.
 *    - In this case, exportedLayout should be called  using 'withSymbols=true' and the importLayout should have 'noDataLoad=false' and 'managePeriodicity=true'.
 * 3. Reset layout on an already existing chart without changing the primary symbol or adding additional symbols:
 *    - This is used when restoring a 'view' on an already existing chart from a previous `loadChart` call. The primary symbol remains the same, no additional series are added, but periodicity, range, studies and chart type are restored from the previously serialized view.
 *    - In this case, exportedLayout should be called  using 'withSymbols=false', and importLayout should have 'noDataLoad=false', managePeriodicity=true', and 'preserveTicksAndCandleWidth=true'.
 *
 * **Important Notes:**
 * - Please note that [studyOverlayEdit]{@link CIQ.ChartEngine~studyOverlayEditEventListener} and [studyPanelEdit]{@link CIQ.ChartEngine~studyPanelEditEventListener} event listeners must be set *before* you call {@link CIQ.ChartEngine#importLayout}.
 * Otherwise, your imported studies will not have edit capabilities.
 *
 * - When symbols are loaded, this function will set the primary symbol (first on the serialized symbol list) with {@link CIQ.ChartEngine#loadChart}
 * and any overlayed symbol with {@link CIQ.ChartEngine#addSeries}. You must be using a quotefeed to use this workflow.
 *
 * - This method will not remove any currently loaded [series]{@link CIQ.ChartEngine#addSeries}.
 * If your restored layout should not include previously loaded series, you must first iterate trough the {@link CIQ.ChartEngine.Chart#series} object, and systematically call {@link CIQ.ChartEngine#removeSeries} on each entry.
 *
 * - When allowing this method to load data, do not call [addSeries]{@link CIQ.ChartEngine#addSeries}, [importDrawings]{@link CIQ.ChartEngine#importDrawings} or [loadChart]{@link CIQ.ChartEngine#loadChart}
 * in a way that will cause them to run simultaneously with this method, or the results of the layout load will be unpredictable.
 * Instead use this method's callback to ensure data is loaded in the right order.
 *
 * - Since spans and ranges require changes in data and periodicity,
 * they are only imported if params.managePeriodicity is set to true and params.noDataLoad is set to false.
 * If both range and span are present, range takes precedence.
 *
 * @param {object} config A serialized layout generated by {@link CIQ.ChartEngine#exportLayout}.
 * @param {object} [params] Layout behavior parameters.
 * @param {boolean} [params.noDataLoad] If true, then any automatic data loading from the quotefeed will be skipped, including setting periodicity, spans or ranges.
 * 		<p>Data can only be loaded if a quote feed is attached to the chart.
 * @param {boolean} [params.managePeriodicity] If true, then the periodicity will be set from the layout, otherwise periodicity will remain as currently set.
 * 		<p>If the span/range was saved in the layout, it will be restored using the most optimal periodicity as determined by {@link CIQ.ChartEngine#setSpan}.
 * 		<p>Periodicity can only be managed if a quote feed is attached to the chart.
 * 		<p>Only applicable when noDataLoad = false.
 * 		<p>See {@link CIQ.ChartEngine#setPeriodicity} for additional details.
 * @param {boolean} [params.preserveTicksAndCandleWidth] If true then the current candleWidth (horizontal zoom) and scroll (assuming same periodicity) will be maintained and any spans or ranges present in the config will be ignored. Otherwise candle width and span/ranges will be taken from the config and restored.
 * @param {function} [params.cb] An optional callback function to be executed once the layout has been fully restored.
 * @param {function} [params.seriesCB] An optional callback function to be executed after each series is restored (to be added to each {@link CIQ.ChartEngine#addSeries} call).
 * @memberof CIQ.ChartEngine
 * @since
 * - 05-2016-10 Symbols are also loaded if included on the serialization.
 * - 2016-06-21 `preserveTicksAndCandleWidth` now defaults to true.
 * - 3.0.0 Added `noDataLoad` parameter.
 * - 5.1.0 Will now also import extended hours settings.
 * - 5.1.0 Imports the range from layout if it is there to preserve between sessions.
 * - 5.2.0 spans and ranges are only executed if managePeriodicity is true and preserveTicksAndCandleWidth is false.
 */
CIQ.ChartEngine.prototype.importLayout = function (config, params) {
	if (!config) {
		// if no config to restore, nothing to do.
		if (params.cb) params.cb();
		return;
	}

	var self = this;
	var importedPanels = [];
	var requireExtendedHours =
		this.extendedHours &&
		!this.extendedHours.filter &&
		config.extended &&
		!this.layout.extended;
	function sortPanelAxes(panels) {
		function isdefined(i) {
			return !!i;
		}
		function sortSide(importedPanel, member) {
			if (!importedPanel[member] || !importedPanel[member].length) return;
			var panel = panels[importedPanel.name];
			if (!panel) return;
			var panelAxisArr = panel[member];
			var arr = new Array(panelAxisArr.length);
			for (var j = 0; j < panelAxisArr.length; j++) {
				var newPosition = importedPanel[member].indexOf(panelAxisArr[j].name);
				if (newPosition > -1) arr[newPosition] = panelAxisArr[j];
				else arr.push(panelAxisArr[j]);
			}
			if (arr.length) panel[member] = arr.filter(isdefined);
		}
		for (var i = 0; i < importedPanels.length; i++) {
			var importedPanel = importedPanels[i];
			sortSide(importedPanel, "yaxisLHS");
			sortSide(importedPanel, "yaxisRHS");
		}
		self.chart.yAxis = self.chart.panel.yAxis;
	}

	if (typeof params !== "object") {
		// backwards compatibility logic. This function used to accept three named arguments
		params = {
			managePeriodicity: arguments[1],
			preserveTicksAndCandleWidth: arguments[2]
		};
	}
	var layout = this.layout,
		originalLayout = CIQ.shallowClone(layout);
	var managePeriodicity = params.managePeriodicity,
		cb = params.cb,
		seriesCB = params.seriesCB,
		noDataLoad = params.noDataLoad;
	var preserveTicksAndCandleWidth = params.preserveTicksAndCandleWidth;

	var exportedDrawings = null;
	if (this.exportDrawings) {
		exportedDrawings = this.exportDrawings();
		this.abortDrawings();
	}

	this.currentlyImporting = true;
	// must remove studies before cleaning the overlays, or the remove function will be lost.
	for (var s in layout.studies) {
		var sd = layout.studies[s];
		CIQ.getFn("Studies.removeStudy")(this, sd);
	}
	this.overlays = {};

	// Keep a copy of the prior panels. We'll need these in order to transfer the holders
	var priorPanels = CIQ.shallowClone(this.panels);
	this.panels = {};

	// clone into view to prevent corrupting the original config object.
	var view = CIQ.clone(config);

	// Flip chart upside down if flipped but set
	if (layout.flipped) this.flipChart(layout.flipped);

	var panels = view.panels; // make a copy of the panels
	var p;
	var panel;
	var yAxis;
	var sortByIndex = function (l, r) {
		return l.index < r.index ? -1 : 1;
	};
	for (p in panels) {
		if (!("index" in panels[p])) sortByIndex = null; // unable to sort
		panel = panels[p];
		panel.name = p;
		importedPanels.push(panel);
	}
	layout.panels = {}; // erase the panels
	var panelToSolo = null;

	if (importedPanels.length > 0) {
		// rebuild the panels
		if (sortByIndex) importedPanels.sort(sortByIndex);
		for (var i = 0; i < importedPanels.length; ++i) {
			panel = importedPanels[i];
			yAxis = panel.yAxis ? new CIQ.ChartEngine.YAxis(panel.yAxis) : null;
			this.stackPanel(
				panel.display,
				panel.name,
				panel.percent,
				panel.chartName,
				yAxis
			);
			if (panel.soloing) panelToSolo = this.panels[panel.name];
		}
	}
	if (CIQ.isEmpty(panels)) {
		this.stackPanel("chart", "chart", 1, "chart");
	}
	this.resizeCanvas();

	// Transfer the holders and DOM element references to panels that were retained when the config switched
	// Delete panels that weren't
	for (var panelName in priorPanels) {
		var oldPanel = priorPanels[panelName];
		var newPanel = this.panels[panelName];
		if (newPanel) {
			this.container.removeChild(newPanel.holder);
			if (oldPanel.handle) this.container.removeChild(oldPanel.handle);
			var copyFields = {
				holder: true,
				subholder: true,
				display: true,
				icons: true
			};
			for (var f in copyFields) {
				newPanel[f] = oldPanel[f];
			}
			this.configurePanelControls(newPanel);
			if (oldPanel.chart.panel == oldPanel) oldPanel.chart.panel = newPanel; // retain reference to the actual chart panel
		} else {
			this.privateDeletePanel(oldPanel);
		}
	}
	this.chart.panel = this.panels.chart; // make sure these are the same!

	sortPanelAxes(this.panels);
	// copy all settings to the chart layout, but maintain the original periodicity,
	// which is handled later on depending on managePeriodicity and noDataLoad settings.
	Object.assign(layout, Object.assign(CIQ.clone(view), { studies: {} }));
	layout.periodicity = originalLayout.periodicity;
	layout.interval = originalLayout.interval;
	layout.timeUnit = originalLayout.timeUnit;
	layout.setSpan = originalLayout.setSpan;
	layout.range = originalLayout.range;

	// must restore candleWidth before you draw any charts or series, including study charts. The config does not always provide the candleWidth
	if (preserveTicksAndCandleWidth) {
		layout.candleWidth = originalLayout.candleWidth;
	} else {
		if (!layout.candleWidth) layout.candleWidth = 8;
	}
	this.setCandleWidth(layout.candleWidth);

	// Force a rebind on the headsUp
	layout.headsUp = CIQ.clone(layout.headsUp);

	var studies = CIQ.clone(view.studies);
	for (var ss in studies) {
		var study = studies[ss];
		var sda = CIQ.getFn("Studies.addStudy")(
			this,
			study.type,
			study.inputs,
			study.outputs,
			study.parameters,
			study.panel
		);
		if (!sda) continue;
		if (study.disabled) {
			sda.toggleDisabledState(this);
		}
		if (study.signalData) {
			sda.signalData = study.signalData;
			var studyPanel = this.panels[sda.panel];
			if (this.checkForEmptyPanel(studyPanel, true, sda)) {
				studyPanel.hidden = true;
				studyPanel.percent = 0;
			}
		}
	}

	if (this.extendedHours)
		this.extendedHours.prepare(layout.extended, layout.marketSessions);

	if (typeof layout.chartType == "undefined") layout.chartType = "line";
	this.setMainSeriesRenderer();

	if (panelToSolo) this.panelSolo(panelToSolo);
	this.adjustPanelPositions();
	sortPanelAxes(this.panels);
	this.storePanels();

	function postLayoutChange(err) {
		if (exportedDrawings) self.importDrawings(exportedDrawings);
		self.currentlyImporting = false;
		if (err) return;
		// Below is logic for re-adding the series used by studies.
		// We need this because we've removed the existing series when we removed studies.
		// When we readded studies we suspended the data loading since we were in the middle of importing
		// so here after turning off the importing flag, we readd these series to cause an initial load of its data
		// Note we need to reload the series data since it was cleaned out of masterData by removeStudy().
		var found;
		function cb() {
			self.createDataSet();
			sortPanelAxes(self.panels);
			self.calculateYAxisPositions();
			self.calculateYAxisMargins(self.chart.yAxis);
			self.draw();
		}
		// For some series (such as those based on price relative studies) `addSeries()` will check whether there
		// already exist series with a matching symbol (to avoid refetching data). When we are removing and then
		// readding series, we need to remove them all before readding any. This is because not yet removed series
		// can cause readded studies to not get initialized properly.
		var series;
		var seriesToReadd = [];
		for (var s in self.chart.series) {
			if (!self.removeSeries) break;
			series = self.chart.series[s];
			if (series.parameters.bucket == "study") {
				found = true;
				self.removeSeries(series);
				seriesToReadd.push(series);
			}
		}
		for (var i = 0; i < seriesToReadd.length; i++) {
			series = seriesToReadd[i];
			var addFcn = series.parameters.isEvent ? "addEvent" : "addSeries";
			self[addFcn](series.id, series.parameters, cb);
		}
		if (!found) self.draw();
		if (layout.crosshair) {
			self.centerCrosshairs();
			self.doDisplayCrosshairs();
		}

		self.updateListeners("layout"); // tells listening objects that layout has changed
		self.changeOccurred("layout"); // dispatches to callbacklisteners
	}

	function cb2() {
		if (self.layout.studies) {
			for (var s3 in self.layout.studies) {
				// fix up any studies which are based off a series, since series were added after studies.
				var seriesStudy = self.layout.studies[s3];
				if (
					!seriesStudy.inputs.Series ||
					seriesStudy.inputs.Series === "series"
				)
					continue;
				CIQ.getFn("Studies.replaceStudy")(
					this,
					seriesStudy.inputs.id,
					seriesStudy.type,
					seriesStudy.inputs,
					seriesStudy.outputs,
					seriesStudy.parameters,
					seriesStudy.panel
				);
			}
		}
		self.calculateYAxisPositions();
		sortPanelAxes(self.panels);
		if (seriesCB) seriesCB();
	}
	if (!noDataLoad) {
		// Now we execute the data loading functions.
		if (view.symbols && view.symbols.length) {
			// load symbols; primary and additional series. Also adjust ranges and periodicity at the same time

			var params2 = {
				chart: this.chart
			};
			if (
				!preserveTicksAndCandleWidth &&
				managePeriodicity &&
				view.range &&
				Object.keys(view.range).length
			) {
				// spans and ranges are only executed if managePeriodicity is true and preserveTicksAndCandleWidth is false.
				params2.range = view.range;
			} else if (
				!preserveTicksAndCandleWidth &&
				managePeriodicity &&
				view.setSpan &&
				Object.keys(view.setSpan).length
			) {
				// see above
				params2.span = view.setSpan;
			} else if (managePeriodicity && view.interval) {
				// otherwise, import periodicity if available
				params2.periodicity = {
					interval: view.interval,
					period: view.periodicity,
					timeUnit: view.timeUnit
				};
			} else {
				// otherwise, maintain prior periodicity
				params2.periodicity = {
					interval: originalLayout.interval,
					period: originalLayout.periodicity,
					timeUnit: originalLayout.timeUnit
				};
			}

			var symbolObject = view.symbols[0].symbolObject || view.symbols[0].symbol;

			this.loadChart(symbolObject, params2, function (err) {
				if (!err) {
					for (var smbl, i = 1; i < view.symbols.length; ++i) {
						if (!self.addSeries) break;
						smbl = view.symbols[i];
						if (!smbl.parameters) smbl.parameters = {};
						var parameters = CIQ.clone(smbl.parameters);
						if (this.panels[parameters.panel]) {
							var addFcn = parameters.isEvent ? "addEvent" : "addSeries";
							self[addFcn](smbl.id, parameters, cb2);
						} else {
							console.warn(
								'Warning: Series "' +
									smbl.id +
									'" could not be imported due to a missing corresponding panel "' +
									parameters.panel +
									'"'
							);
						}
					}
					if (view.chartScale) self.setChartScale(view.chartScale);
				}
				postLayoutChange(err);
				if (cb) cb.apply(null, arguments);
			});
			return;
		}

		// Otherwise, if only data ranges or periodicity are required, load them now

		if (managePeriodicity) {
			if (!preserveTicksAndCandleWidth && this.setRange) {
				// spans and ranges are only executed if managePeriodicity is true and preserveTicksAndCandleWidth is false.
				var range = view.range;
				if (range && Object.keys(range).length && this.chart.symbol) {
					this.setRange(range, function () {
						postLayoutChange();
						if (cb) cb();
					});
					return;
				} else if (
					view.setSpan &&
					Object.keys(view.setSpan).length &&
					this.chart.symbol
				) {
					this.setSpan(view.setSpan, function () {
						postLayoutChange();
						if (cb) cb();
					});
					return;
				}
			}

			var interval = view.interval;
			var periodicity = view.periodicity;
			var timeUnit = view.timeUnit;
			if (isNaN(periodicity)) periodicity = 1;
			if (!interval) interval = "day";
			// this will get new data or roll up existing, createDataSet() and draw()
			this.setPeriodicity(
				{
					period: periodicity,
					interval: interval,
					timeUnit: timeUnit,
					getDifferentData: requireExtendedHours
				},
				function () {
					postLayoutChange();
					if (cb) cb();
				}
			);
			return;
		}
	}

	// if we got here, no data loading was requested.
	if (managePeriodicity) {
		layout.periodicity = view.periodicity;
		layout.interval = view.interval;
		layout.timeUnit = view.timeUnit;
		layout.setSpan = view.setSpan;
	}

	this.createDataSet();
	if (!preserveTicksAndCandleWidth) this.home();
	postLayoutChange();
	if (cb) cb();
};

/**
 * Exports the current layout into a serialized form. The returned object can be passed into {@link CIQ.ChartEngine#importLayout} to restore the layout at a future time.
 *
 * This method will also save any programmatically activated [range]{@link CIQ.ChartEngine#setRange} or [span]{@link CIQ.ChartEngine#setSpan} setting that is still active.
 *
 * > **Note:** A set range or span that is manually modified by a user when zooming, panning, or changing periodicity will be nullified.
 * > So, if you wish to always record the current range of a chart for future restoration, you must use the following process:
 *
 * > 1- Add the following injection to save the range on every draw operation:
 * > ```
 * > stxx.append("draw", function() {
 * >     const dataSegment = stxx.chart.dataSegment;
 * >	 if (!dataSegment.length) return;
 * >     const dtLeft = dataSegment[0].DT,
 * >         dtRight = dataSegment[dataSegment.length - 1].DT;
 * >     if (!dtLeft || !dtRight || dtLeft >= dtRight) return;
 * >     delete stxx.layout.setSpan;
 * >     stxx.layout.range={padding: stxx.preferences.whitespace,
 * >         dtLeft,
 * >         dtRight,
 * >         periodicity: {
 * >             period: stxx.layout.periodicity,
 * >             interval: stxx.layout.interval,
 * >             timeUnit: stxx.layout.timeUnit
 * >         }
 * >     }
 * >     CIQ.ChartEngine.getSaveLayout([config])({stx:stxx})
 * > });
 * > ```
 *
 * > 2- Make sure you call [importLayout]{@link CIQ.ChartEngine#importLayout} with params `preserveTicksAndCandleWidth` set to `false`
 *
 * > More on injections here: {@tutorial Using the Injection API}
 *
 * @param {boolean} withSymbols If `true`, include the chart's current primary symbol and any secondary symbols from any {@link CIQ.ChartEngine#addSeries} operation, if using a quote feed. Studies will be excluded from this object. The resulting list will be in the `symbols` element of the serialized object.
 * @return {object} The serialized form of the layout.
 * @memberof CIQ.ChartEngine
 * @since
 * - 05-2016-10 Added the `withSymbols` parameter.
 * - 5.0.0 `obj.symbols` is explicitly removed from the serialization when `withSymbols` is not true.
 */
CIQ.ChartEngine.prototype.exportLayout = function (withSymbols) {
	var obj = {};
	// First clone all the fields, these describe the layout
	for (var field in this.layout) {
		if (field != "studies" && field != "panels" && field != "drawing") {
			obj[field] = CIQ.clone(this.layout[field]);
		} else if (field == "studies") {
			obj.studies = {};
		} else if (field == "panels") {
			obj.panels = {};
		}
	}

	function serializeAxisNames(axisArr) {
		var nameArr = [];
		for (var i = 0; i < axisArr.length; i++) {
			nameArr.push(axisArr[i].name);
		}
		return nameArr;
	}

	// Serialize the panels
	var i = 0;
	for (var panelName in this.panels) {
		var p = this.panels[panelName];
		if (p.exportable === false) continue;
		var panel = (obj.panels[panelName] = {});
		panel.percent = p.percent;
		panel.display = p.display;
		panel.chartName = p.chart.name;
		panel.soloing = p.soloing;
		panel.index = i++;
		panel.yAxis = { name: p.yAxis.name, position: p.yAxis.position };
		if (p.yaxisLHS) panel.yaxisLHS = serializeAxisNames(p.yaxisLHS);
		if (p.yaxisRHS) panel.yaxisRHS = serializeAxisNames(p.yaxisRHS);
	}

	// Serialize the studies
	for (var studyName in this.layout.studies) {
		var study = (obj.studies[studyName] = {});
		var s = this.layout.studies[studyName];
		study.type = s.type;
		study.inputs = CIQ.clone(s.inputs);
		study.outputs = CIQ.clone(s.outputs);
		study.panel = s.panel;
		study.parameters = CIQ.clone(s.parameters);
		study.disabled = s.disabled;
		if (s.signalData) {
			if (s.signalData.cloneForExport)
				study.signalData = s.signalData.cloneForExport();
			else study.signalData = CIQ.clone(s.signalData);
		}
	}

	if (withSymbols) {
		obj.symbols = this.getSymbols({
			"include-parameters": true,
			"exclude-studies": true,
			"exclude-generated": true,
			"exclude-nostore": true
		});
		// If main series was static data, delete that reference. Static data is not saved
		if (
			obj.symbols.length &&
			obj.symbols[0].symbolObject &&
			obj.symbols[0].symbolObject.static
		)
			delete obj.symbols[0].symbolObject.static;
	} else {
		delete obj.symbols;
	}

	return obj;
};

/**
 * Imports a user's preferences from a saved location and uses them in the ChartEngine.
 * To save preferences see {@link CIQ.ChartEngine#exportPreferences}
 * @param {object} preferences An object of {@link CIQ.ChartEngine#preferences}
 * @memberof CIQ.ChartEngine
 * @since 4.0.0
 */
CIQ.ChartEngine.prototype.importPreferences = function (preferences) {
	CIQ.extend(this.preferences, preferences);
	if (preferences.timeZone)
		this.setTimeZone(this.dataZone, preferences.timeZone);
	if (preferences.language && CIQ.I18N) {
		if (this.uiContext && this.uiContext.config.setHtmlLang)
			document.documentElement.setAttribute("lang", preferences.language);
		CIQ.I18N.localize(this, preferences.language);
	}
	this.changeOccurred("preferences");
};

/**
 * Exports the {@link CIQ.ChartEngine#preferences} for external storage.
 * Can then be imported again after being parsed with {@link CIQ.ChartEngine#importPreferences}
 * @memberof CIQ.ChartEngine
 * @returns {CIQ.ChartEngine#preferences}
 * @since 4.0.0
 */
CIQ.ChartEngine.prototype.exportPreferences = function () {
	return this.preferences;
};

};
__js_standard_storage_(typeof window !== "undefined" ? window : global);
