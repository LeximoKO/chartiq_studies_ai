import { CIQ as _CIQ } from "../../../js/chartiq.js";
import "../../standard/studies.js";

let __js_advanced_studies_macd_ = (_exports) => {

    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

    if (!CIQ.Studies) {
        console.error("macd feature requires first activating the studies feature.");
    } else {

        CIQ.Studies.calculateMACD = function (stx, sd) {
            var quotes = sd.chart.scrubbed;
            var inputs = sd.inputs,
                name = sd.name;
            
            if (!sd.macd1Days) 
                sd.macd1Days = parseFloat(inputs["Fast MA Period"]);
            if (!sd.macd2Days) 
                sd.macd2Days = parseFloat(inputs["Slow MA Period"]);
            if (!sd.signalDays) 
                sd.signalDays = parseFloat(inputs["Signal Period"]);
            if (!sd.days) 
                sd.days = Math.max(sd.macd1Days, sd.macd2Days, sd.signalDays);
            if (quotes.length < sd.days + 1) {
                sd.error = true;
                return;
            }

            var field = sd.inputs.Field;
            if (!field || field == "field") 
                field = "Close";

            var maType = inputs["Moving Average Type"];
            if (!maType) 
                maType = "exponential";

            CIQ.Studies.MA(maType, sd.macd1Days, field, 0, "_MACD1", stx, sd);
            CIQ.Studies.MA(maType, sd.macd2Days, field, 0, "_MACD2", stx, sd);

            var i,
                quote,
                start = Math.max(sd.startFrom, sd.days - 1);
            for (i = start; i < quotes.length; i++) {
                quote = quotes[i];
                if (
                    (quote["_MACD1 " + name] || quote["_MACD1 " + name] === 0) &&
                    (quote["_MACD2 " + name] || quote["_MACD2 " + name] === 0)
                )
                    quote["MACD " + name] =
                        quote["_MACD1 " + name] - quote["_MACD2 " + name];
            }
            var sigMaType = inputs["Signal MA Type"];
            if (!sigMaType) 
                sigMaType = "exponential";

            CIQ.Studies.MA(
                sigMaType,
                sd.signalDays,
                "MACD " + name,
                0,
                "Signal",
                stx,
                sd
            );

            var histogram = name + "_hist";
            for (i = start; i < quotes.length; i++) {
                quote = quotes[i];
                var signal = quote["Signal " + name];
                if (!signal && signal !== 0) 
                    continue; // don't create histogram before the signal line is valid
                quote[histogram] = quote["MACD " + name] - quote["Signal " + name];
            }
            sd.outputMap[histogram] = "";
        };

        CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
            "test5": {
                name: "test5",
                calculateFN: CIQ.Studies.calculateMACD,
                seriesFN: CIQ.Studies.displayHistogramWithSeries,
                inputs: {
                    "Fast MA Period": 12,
                    "Slow MA Period": 26,
                    "Signal Period": 9
                },
                outputs: {
                    MACD: "auto",
                    Signal: "#FF0000",
                    "Increasing Bar": "#00DD00",
                    "Decreasing Bar": "#FF0000"
                }
            }
        });
    }

};

__js_advanced_studies_macd_(typeof window !== "undefined" ? window : global);