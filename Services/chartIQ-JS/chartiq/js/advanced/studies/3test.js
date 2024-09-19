// import { CIQ as _CIQ } from "../../../js/chartiq.js";
// import "../../standard/studies.js";

// let __js_advanced_studies_SMA_ = (_exports) => {

//     var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

//     if (!CIQ.Studies) {
//         console.error(
//             "test3 feature requires the studies feature to be activated."
//         );
//     } else {
       
//         CIQ.Studies.calculateCustomSMA = function (stx, sd) {
//             const quotes = sd.chart.scrubbed;
//             const period = sd.inputs.Period;
//             for (let i = period - 1; i < quotes.length; i++) {
//                 let sum = 0;
//                 for (let j = i - period + 1; j <= i; j++) {
//                     sum += quotes[j][sd.inputs.Field];
//                 }
//                 quotes[i]["SMA " + sd.name] = sum / period;
//             }
//         };

//         // Регистрация стадии в библиотеке
//         CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
//             "test3": {
//                 name: "test3",
//                 calculateFN: CIQ.Studies.calculateCustomSMA,
//                 inputs: { Period: 10, Field: "Close" },  
//                 outputs: { SMA: "blue" },  // Цвет линии SMA
//                 seriesFN: CIQ.Studies.displaySeriesAsLine  // Отображение линии
//             }
//         });
//     }
// };

// __js_advanced_studies_SMA_(typeof window !== "undefined" ? window : global);
