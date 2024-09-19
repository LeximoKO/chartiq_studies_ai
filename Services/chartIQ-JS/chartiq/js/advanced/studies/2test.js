import { CIQ as _CIQ } from "../../../js/chartiq.js";
import "../../standard/studies.js";

let __js_advanced_studies_TMDB_ = (_exports) => {

    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

    if (!CIQ.Studies) {
        console.error(
            "test2 feature requires the studies feature to be activated."
        );
    } else {
        CIQ.Studies.calculateTMDB = function (stx, sd) {
            const quotes = sd.chart.scrubbed;
            const period = sd.inputs.Period;
            const momentumPeriod = sd.inputs.MomentumPeriod;
            const threshold = sd.inputs.Threshold;

            for (let i = Math.max(period, momentumPeriod); i < quotes.length; i++) {
                let sum = 0, momentumSum = 0;

                for (let j = i - period + 1; j <= i; j++) {
                    sum += quotes[j][sd.inputs.Field];
                }
                const avg = sum / period;

                const priceChange = quotes[i][sd.inputs.Field] - quotes[i - momentumPeriod][sd.inputs.Field];
                const momentum = priceChange / momentumPeriod;

                let upperBand, lowerBand;
                if (momentum > threshold) {
                    upperBand = avg + (avg * (momentum / 100));  
                    lowerBand = avg - (avg * (threshold / 100)); 
                } else {
                    upperBand = avg + (avg * (threshold / 100));
                    lowerBand = avg - (avg * (momentum / 100)); 
                }

                quotes[i]["Upper " + sd.name] = upperBand;
                quotes[i]["Lower " + sd.name] = lowerBand;
                quotes[i]["Momentum " + sd.name] = momentum;
            }
        };

        CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
            "test2": {
                name: "test2",
                calculateFN: CIQ.Studies.calculateTMDB,
                inputs: { Period: 20, MomentumPeriod: 10, Threshold: 5, Field: "Close" },  
                outputs: { Upper: "red", Lower: "green", Momentum: "blue" },  
                seriesFN: CIQ.Studies.displaySeriesAsLine  
            }
        });
    }
};

__js_advanced_studies_TMDB_(typeof window !== "undefined" ? window : global);
