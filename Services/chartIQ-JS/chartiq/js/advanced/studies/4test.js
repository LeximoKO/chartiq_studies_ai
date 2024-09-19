import { CIQ as _CIQ } from "../../../js/chartiq.js";
import "../../standard/studies.js";

const initializeRedGreenBands = (_exports) => {
  const CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

  if (!CIQ.Studies) {
    console.error("test4 feature requires first activating studies feature.");
    return;
  }

  // Функция для расчета красных и зеленых полос
  CIQ.Studies.calculateRedGreenBands = function (stx, sd) {
    const quotes = sd.chart.scrubbed;
    let high = -Infinity;
    let low = Infinity;

    for (let i = sd.startFrom; i < quotes.length; i++) {
      const quote = quotes[i];
      high = Math.max(high, quote.High);
      low = Math.min(low, quote.Low);

      quote[`Red Band ${sd.name}`] = high;
      quote[`Green Band ${sd.name}`] = low;
    }
  };

  // Функция для отображения красных и зеленых полос
  CIQ.Studies.displayRedGreenBands = function (stx, sd, quotes) {
    const panel = stx.panels[sd.panel];
    const context = sd.getContext(stx);

    // Рисование красной полосы
    context.beginPath();
    quotes.forEach((quote, i) => {
      const x = stx.pixelFromBar(i);
      const yHigh = stx.pixelFromPrice(quote[`Red Band ${sd.name}`], panel);

      if (i === 0) {
        context.moveTo(x, yHigh);
      } else {
        context.lineTo(x, yHigh);
      }
    });
    context.strokeStyle = sd.outputs.red;
    context.stroke();

    // Рисование зеленой полосы
    context.beginPath();
    quotes.forEach((quote, i) => {
      const x = stx.pixelFromBar(i);
      const yLow = stx.pixelFromPrice(quote[`Green Band ${sd.name}`], panel);

      if (i === 0) {
        context.moveTo(x, yLow);
      } else {
        context.lineTo(x, yLow);
      }
    });
    context.strokeStyle = sd.outputs.green;
    context.stroke();
  };

  // Добавление новой библиотеки исследований для красных и зеленых полос
  CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
    "test4": {
      name: "test4",
      overlay: true,
      calculateFN: CIQ.Studies.calculateRedGreenBands,
      seriesFN: CIQ.Studies.displayRedGreenBands,
      inputs: {},
      outputs: {
        red: "red",
        green: "green",
      },
    },
  });
};

initializeRedGreenBands(typeof window !== "undefined" ? window : global);
