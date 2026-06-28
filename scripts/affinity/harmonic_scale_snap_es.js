'use strict';
/*
 * Escala armónica — Ajustar tamaño de fuente (v1.0, Español)
 *
 * Seleccioná texto (o un cuadro de texto) y corré este script. Lee el
 * tamaño de fuente actual, busca el valor más cercano en una escala
 * armónica (una unidad base multiplicada por una proporción elevada a un
 * número entero -- la misma matemática que la Calculadora de Escala
 * Armónica del web app y el Modo Armónico del generador de retícula), y
 * ajusta la selección a ese valor.
 *
 * Esto NO crea un Text Style con nombre -- el SDK de Affinity no tiene
 * forma de registrar uno (ver el hint documentado sobre esto). Ajusta el
 * tamaño de fuente directamente, que es lo más cercano alcanzable por
 * script.
 */

const { Document } = require('/document.js');
const { SubSelectionType } = require('/selections.js');
const { StoryDelta, GlyphAttDoubleType } = require('/storydelta.js');
const { Dialog, DialogResult } = require('/dialog.js');
const { UnitType } = require('/units.js');

const RATIO_VALUES = [1.618, 1.414, 1.5, 1.333, 1.25, 2];
const RATIO_LABELS = [
  'Phi - Áurea (1.618)',
  'raíz de 2 (1.414)',
  'Quinta - 3:2 (1.5)',
  'Cuarta - 4:3 (1.333)',
  'Tercera mayor - 5:4 (1.25)',
  'Octava - 2:1 (2.0)',
  'Personalizado',
];

// Lee un tamaño de fuente representativo de lo que esté seleccionado --
// funciona tanto si se seleccionó el cuadro de texto entero como objeto,
// como si hay un rango de texto específico seleccionado adentro.
function getCurrentHeight(doc) {
  for (const item of doc.selection.items) {
    const node = item.node;
    if (!node || !node.storyInterface) continue;
    const story = node.storyInterface.story;
    if (story.length === 0) continue;
    let pos = 0;
    const textSub = item.getSubSelectionOfType(SubSelectionType.Text);
    if (textSub && !textSub.isEmpty && textSub.rangeCount > 0) {
      const r = textSub.ranges[0];
      pos = Math.min(Math.min(r.begin, r.end), story.length - 1);
    }
    return story.getGlyphAtts(pos).height;
  }
  return null;
}

// Busca la potencia de `ratio` desde `base` más cercana a `current`,
// redondeada al medio punto más próximo (la misma granularidad de
// redondeo que se usa en el resto de Swiss Grid Explorer).
function snappedSize(current, base, ratio) {
  if (current <= 0 || base <= 0 || ratio <= 1) return base;
  const step = Math.round(Math.log(current / base) / Math.log(ratio));
  return Math.round(base * Math.pow(ratio, step) * 2) / 2;
}

const doc = Document.current;
if (!doc) {
  console.log('[Escala armónica] No hay documento abierto.');
} else {
  const current = getCurrentHeight(doc);
  if (current == null) {
    console.log('[Escala armónica] Seleccioná texto (o un cuadro de texto) primero.');
  } else {
    const dlg = Dialog.create('Escala armónica \u2014 Ajustar tamaño de fuente');
    const col = dlg.addColumn();
    const grp = col.addGroup('Ajustes');

    const ratioCombo = grp.addComboBox('Proporción', RATIO_LABELS, 0);
    const customBox = grp.addTextBox('Proporción personalizada', '1.618');
    customBox.isEnabled = false;
    const baseEdit = grp.addUnitValueEditor('Unidad base', UnitType.Point, UnitType.Point, 12, 1, 500);
    const info = grp.addStaticText('', '');

    function currentRatio() {
      if (ratioCombo.selectedIndex === RATIO_VALUES.length) {
        const v = parseFloat(customBox.text);
        return (isNaN(v) || v <= 1) ? 1.618 : v;
      }
      return RATIO_VALUES[ratioCombo.selectedIndex];
    }

    function updateInfo() {
      const target = snappedSize(current, baseEdit.value, currentRatio());
      info.text = 'Actual: ' + current.toFixed(1) + ' pt  ->  ajusta a: ' + target.toFixed(1) + ' pt';
    }

    ratioCombo.onValueChangedHandler = () => {
      customBox.isEnabled = (ratioCombo.selectedIndex === RATIO_VALUES.length);
      updateInfo();
    };
    customBox.onValueChangedHandler = updateInfo;
    baseEdit.onValueChangedHandler = updateInfo;
    updateInfo();

    if (dlg.runModal() === DialogResult.Ok) {
      const target = snappedSize(current, baseEdit.value, currentRatio());
      const delta = StoryDelta.createGlyphDouble(GlyphAttDoubleType.Height, target);
      doc.formatText(delta, doc.selection);
      console.log('[Escala armónica] Ajustado ' + current.toFixed(1) + ' pt -> ' + target.toFixed(1) + ' pt');
    }
  }
}
