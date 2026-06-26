// ============================================================================
// Swiss Grid Explorer (v1.2)
// ============================================================================

if (app.documents.length === 0) {
    alert("Error: Por favor, abre un documento primero.");
} else {
    var VERSION = "v1.2";
    var doc = app.activeDocument;
    
    var oldCoordinateSystem = app.coordinateSystem;
    app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

    var activeABIndex = doc.artboards.getActiveArtboardIndex();
    var activeAB = doc.artboards[activeABIndex];
    var bounds = activeAB.artboardRect;
    var abTag = "AB" + (activeABIndex + 1);

    var docLeft = bounds[0]; var docTop = bounds[1];
    var docRight = bounds[2]; var docBottom = bounds[3];
    var docWidthPts = Math.abs(docRight - docLeft);
    var docHeightPts = Math.abs(docTop - docBottom);

    // --- DICCIONARY ---
    var dict = {
        es: {
            title: "Swiss Grid Explorer " + VERSION, lang: "Idioma:", unit: "Unidad:", preview: "Previsualización",
            settings: "Ajustes Paramétricos", width: "Ancho: ", height: "Alto: ", ratio: "Proporción: ",
            calc: "Calculando...", cols: "Columnas:", rows: "Filas:", margins: "Márgenes:", gutter: "Medianil:",
            horizAlert: "Proporción Horizontal (Evitar en texto)", vertAlert: "Proporción Vertical (Óptima)",
            squareAlert: "Proporción Cuadrada (Excelente)", errorAlert: "Error: Márgenes excesivos.",
            cancel: "Cancelar", apply: "Aplicar", layerGrid: "Retícula Suiza", layerDesign: "Diseño",
            layerGuides: "Guías Magnéticas", galleryTitle: "Retículas Icónicas", ioTitle: "Exportar / Importar Ajustes",
            btnExport: "Exportar", btnImport: "Importar", chkGuides: "Generar Guías Magnéticas (Nativas)",
            helpGuides: "Dibuja líneas de guía nativas en una capa independiente para ajustar objetos automáticamente.",
            helpGalTitle: "Sobre las Retículas Icónicas",
            helpGalText: "Modelos históricos de diseño. Pasa el cursor sobre la miniatura para ver los detalles.",
            helpIOTitle: "Exportar / Importar",
            helpIOText: "Guarda tu configuración en un archivo JSON externo.",
            dialogSave: "Guardar Ajustes", dialogLoad: "Cargar Ajustes", errParse: "Error al leer el archivo JSON.",
            scope: "Aplicar a:", scopeActive: "Mesa de trabajo activa", scopeAll: "Todas las mesas", scopeRange: "Rango...",
            rangeLabel: "Rango:", rangeHint: "ej. 1-3, 5", proportional: "Escalar proporcionalmente por mesa",
            helpScopeTitle: "Aplicar a varias mesas de trabajo",
            helpScopeText: "Activa: solo la mesa actual.\nTodas: cada mesa del documento.\nRango: las mesas que indiques (ej. 1-3, 5).\n\nEscalar proporcionalmente: cada mesa recibe una retícula adaptada a su propio tamaño (márgenes y medianil en proporción). Si lo desactivas, se usan los mismos valores fijos en todas.",
            errRange: "Rango no válido. Usá números, guiones y comas (ej. 1-3, 5).",
            btnAbout: "Acerca de...",
            aboutTitle: "Acerca de Swiss Grid Explorer",
            aboutText: "Swiss Grid Explorer " + VERSION + "\n\nUna herramienta de diseño paramétrico para la generación de retículas estructurales precisas en Adobe Illustrator.\n\nConcepto, UX/UI y Diseño: Victor Crespo www.3dvic.com\n2026 - Gracias por usarlo!."
        },
        en: {
            title: "Swiss Grid Explorer " + VERSION, lang: "Language:", unit: "Unit:", preview: "Preview",
            settings: "Parametric Settings", width: "Width: ", height: "Height: ", ratio: "Ratio: ",
            calc: "Calculating...", cols: "Columns:", rows: "Rows:", margins: "Margins:", gutter: "Gutter:",
            horizAlert: "Horizontal Ratio (Avoid for text)", vertAlert: "Vertical Ratio (Optimal)",
            squareAlert: "Square Ratio (Excellent)", errorAlert: "Error: Excessive margins.",
            cancel: "Cancel", apply: "Apply", layerGrid: "Swiss Grid", layerDesign: "Design",
            layerGuides: "Magnetic Guides", galleryTitle: "Iconic Grids", ioTitle: "Export / Import Settings",
            btnExport: "Export", btnImport: "Import", chkGuides: "Generate Magnetic Guides (Native)",
            helpGuides: "Draws native guide lines in a separate layer for automatic object snapping.",
            helpGalTitle: "About Iconic Grids",
            helpGalText: "Historical design presets. Hover over the thumbnail for details.",
            helpIOTitle: "Export / Import",
            helpIOText: "Save your configuration to an external JSON file.",
            dialogSave: "Save Settings", dialogLoad: "Load Settings", errParse: "Error reading JSON file.",
            scope: "Apply to:", scopeActive: "Active artboard", scopeAll: "All artboards", scopeRange: "Range...",
            rangeLabel: "Range:", rangeHint: "e.g. 1-3, 5", proportional: "Scale proportionally per artboard",
            helpScopeTitle: "Apply to multiple artboards",
            helpScopeText: "Active: only the current artboard.\nAll: every artboard in the document.\nRange: the artboards you specify (e.g. 1-3, 5).\n\nScale proportionally: each artboard gets a grid adapted to its own size (margins and gutter scaled). If you turn it off, the same fixed values are used on every artboard.",
            errRange: "Invalid range. Use numbers, dashes and commas (e.g. 1-3, 5).",
            btnAbout: "About...",
            aboutTitle: "About Swiss Grid Explorer",
            aboutText: "Swiss Grid Explorer " + VERSION + "\n\nA parametric design tool for generating precise structural grids in Adobe Illustrator.\n\nConcept, UX/UI & Design: vic (www.3dvic.com)\nCode & Computational Logic: AI Assisted\n\n2026 - Thanks for using it!"
        }
    };
    var currentLang = "es"; function t(key) { return dict[currentLang][key]; }

    var PT_PER_MM = 2.834645; var PT_PER_CM = 28.34645; var PT_PER_IN = 72;
    var unitNames = ["pt", "mm", "cm", "in", "px"];
    function toPts(v, u) { if (u==="mm") return v*PT_PER_MM; if (u==="cm") return v*PT_PER_CM; if (u==="in") return v*PT_PER_IN; return v; }
    function fromPts(v, u) { if (u==="mm") return v/PT_PER_MM; if (u==="cm") return v/PT_PER_CM; if (u==="in") return v/PT_PER_IN; return v; }

    var RANGES = {
        cols:    { min: 1, max: 32 },
        rows:    { min: 1, max: 32 },
        margins: { min: 0, max: 200 },
        gutter:  { min: 0, max: 80 }
    };
    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    // Parse an artboard range string like "1-3, 5" into 0-based indices, validated against count.
    // Returns { ok: true, indices: [...] } or { ok: false }.
    function parseArtboardRange(str, count) {
        if (!str) return { ok: false };
        var parts = String(str).split(",");
        var set = {};
        var out = [];
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i].replace(/^\s+|\s+$/g, "");
            if (p === "") continue;
            var dash = p.indexOf("-");
            if (dash >= 0) {
                var a = parseInt(p.substring(0, dash), 10);
                var b = parseInt(p.substring(dash + 1), 10);
                if (isNaN(a) || isNaN(b)) return { ok: false };
                if (a > b) { var tmp = a; a = b; b = tmp; }
                for (var n = a; n <= b; n++) {
                    if (n < 1 || n > count) return { ok: false };
                    if (!set[n]) { set[n] = true; out.push(n - 1); }
                }
            } else {
                var v = parseInt(p, 10);
                if (isNaN(v) || v < 1 || v > count) return { ok: false };
                if (!set[v]) { set[v] = true; out.push(v - 1); }
            }
        }
        if (out.length === 0) return { ok: false };
        return { ok: true, indices: out };
    }

    // Persisted preferences via app.preferences (survives across runs).
    function prefGetInt(key, def) {
        try { var v = app.preferences.getIntegerPreference(key); return v; } catch (e) { return def; }
    }
    function prefSetInt(key, val) { try { app.preferences.setIntegerPreference(key, val); } catch (e) {} }
    function prefGetStr(key, def) {
        try { var v = app.preferences.getStringPreference(key); return (v === undefined || v === null) ? def : v; } catch (e) { return def; }
    }
    function prefSetStr(key, val) { try { app.preferences.setStringPreference(key, val); } catch (e) {} }

    var state = { cols: 4, rows: 6, margins: 15, gutter: 5 };
    var builtInPresets = [
        { id: "Brockmann",  cols: 8,  rows: 8, marginR: 0.057, gutterR: 0.019,
          tip_es: "Brockmann (8x8)\nRetícula modular densa. El arquetipo del Diseño Suizo sistemático (Grid Systems, 1981). Ideal para layouts editoriales complejos con múltiples jerarquías.",
          tip_en: "Brockmann (8x8)\nDense modular grid. The archetype of systematic Swiss Design (Grid Systems, 1981). Ideal for complex editorial layouts with multiple content hierarchies." },
        { id: "Gerstner",   cols: 6,  rows: 6, marginR: 0.048, gutterR: 0.024,
          tip_es: "Gerstner (6x6)\nRetícula de programa: toda decisión de layout surge de la lógica interna del módulo, no del ojo. Equilibrio entre flexibilidad y sistematismo (Designing Programmes, 1964).",
          tip_en: "Gerstner (6x6)\nProgramme grid: every layout decision follows the module's internal logic, not intuition. Balance of flexibility and systematism (Designing Programmes, 1964)." },
        { id: "Vignelli",   cols: 3,  rows: 4, marginR: 0.086, gutterR: 0.029,
          tip_es: "Vignelli (3x4)\nInspirado en el Unigrid del NPS (1977). 3 columnas amplias con márgenes generosos capturan el carácter editorial de Vignelli. Nota: el sistema original usa un módulo de 10 unidades más complejo.",
          tip_en: "Vignelli (3x4)\nInspired by the NPS Unigrid (1977). 3 wide columns with generous margins capture Vignelli's editorial character. Note: the original system uses a more complex 10-unit module." },
        { id: "Tschichold", cols: 2,  rows: 3, marginR: 0.119, gutterR: 0.038,
          tip_es: "Tschichold (2x3)\n2 columnas amplias con márgenes dramáticos (12% del lado menor). El blanco generoso ES el diseño, no el sobrante. Basado en Die neue Typographie (1928).",
          tip_en: "Tschichold (2x3)\n2 wide columns with dramatic margins (12% of min side). The generous white space IS the design, not the leftover. Based on Die neue Typographie (1928)." },
        { id: "Digital 12", cols: 12, rows: 1, marginR: 0.067, gutterR: 0.022,
          tip_es: "Web · 12 columnas\nEl estándar del diseño web responsive (Bootstrap, Foundation, 960gs). Una sola fila deja el eje vertical libre para el flujo de contenido.",
          tip_en: "Web · 12 columns\nThe responsive web design standard (Bootstrap, Foundation, 960gs). Single row leaves the vertical axis free for content flow." },
        { id: "Slides",     cols: 4,  rows: 3, marginR: 0.083, gutterR: 0.033,
          tip_es: "Slides (4x3)\nRetícula para presentaciones (PowerPoint, Keynote, Google Slides). Aplicar sobre formatos widescreen (1920x1080, 1440x900). Genera módulos apaisados que acompañan el ritmo horizontal de pantallas 16:9.",
          tip_en: "Slides (4x3)\nPresentation grid (PowerPoint, Keynote, Google Slides). Apply on widescreen formats (1920x1080, 1440x900). Produces landscape modules that follow the horizontal rhythm of 16:9 screens." }
    ];

    var presetUIButtons = [];

    function safeParsePreset(jsonString) {
        var s = "";
        for (var i = 0; i < jsonString.length; i++) {
            var ch = jsonString.charAt(i);
            if (ch !== " " && ch !== "\t" && ch !== "\n" && ch !== "\r") s += ch;
        }
        if (s.charAt(0) === "(" && s.charAt(s.length - 1) === ")") s = s.substring(1, s.length - 1);
        if (s.charAt(0) !== "{" || s.charAt(s.length - 1) !== "}") throw new Error("Formato inválido");
        var pattern = /^\{"cols":(-?\d+(?:\.\d+)?),"rows":(-?\d+(?:\.\d+)?),"margins":(-?\d+(?:\.\d+)?),"gutter":(-?\d+(?:\.\d+)?),"unit":"(pt|mm|cm|in|px)"\}$/;
        var m = s.match(pattern);
        if (!m) throw new Error("Estructura JSON no reconocida");
        return { cols: parseFloat(m[1]), rows: parseFloat(m[2]), margins: parseFloat(m[3]), gutter: parseFloat(m[4]), unit: m[5] };
    }

    function getOrCreateLayer(layerName) {
        var targetLayer;
        try { targetLayer = doc.layers.getByName(layerName); targetLayer.locked = false; targetLayer.pageItems.removeAll(); } 
        catch (e) { targetLayer = doc.layers.add(); targetLayer.name = layerName; }
        return targetLayer;
    }

    function showHelpDialog(title, content) {
        var helpWin = new Window("dialog", title); helpWin.orientation = "column"; helpWin.alignChildren = ["fill", "top"]; helpWin.margins = 20;
        var txt = helpWin.add("statictext", undefined, content, {multiline: true}); txt.preferredSize.width = 320;
        var btnClose = helpWin.add("button", undefined, "OK"); btnClose.alignment = ["center", "top"]; btnClose.onClick = function() { helpWin.close(); }; helpWin.show();
    }

    function createHelpLink(parentGroup, onClickCallback) {
        var btn = parentGroup.add("button", undefined, ""); btn.preferredSize = [24, 24]; btn.onClick = onClickCallback;
        btn.onDraw = function() {
            var g = this.graphics; var w = this.size[0]; var h = this.size[1];
            var font = ScriptUI.newFont("Tahoma", "Regular", 12); var color = [0.3, 0.6, 1, 1];
            var pen = g.newPen(g.PenType.SOLID_COLOR, color, 1); var brush = g.newBrush(g.BrushType.SOLID_COLOR, color);
            var text = "?"; var textW = g.measureString(text, font).width; var bracketW = g.measureString("[", font).width;
            var totalW = textW + (bracketW * 2) + 4; var startX = (w - totalW) / 2; var yText = (h / 2) - 6; var yLine = yText + 14;
            g.drawString("[", pen, startX, yText, font); g.drawString(text, pen, startX + bracketW + 2, yText, font); g.drawString("]", pen, startX + bracketW + 2 + textW + 2, yText, font);
            g.newPath(); g.rectPath(startX + bracketW + 2, yLine, textW, 1); g.fillPath(brush);
        };
        return btn;
    }

    // --- MAIN WINDOW ---
    var win = new Window("dialog", t("title"), undefined, {resizeable: true});
    win.orientation = "column"; win.alignChildren = ["fill", "fill"]; win.minimumSize = [540, 820]; win.margins = 15; win.spacing = 10;

    var headerGroup = win.add("group"); headerGroup.alignment = ["fill", "top"]; headerGroup.orientation = "row"; headerGroup.alignChildren = ["fill", "center"];
    var controlsTopGroup = headerGroup.add("group"); controlsTopGroup.add("statictext", undefined, t("lang"));
    var dropLang = controlsTopGroup.add("dropdownlist", undefined, ["Español", "English"]); dropLang.selection = 0;
    controlsTopGroup.add("statictext", undefined, t("unit")); var dropUnits = controlsTopGroup.add("dropdownlist", undefined, unitNames); dropUnits.selection = 1;

    var statsGroup = headerGroup.add("group"); statsGroup.orientation = "row"; statsGroup.alignment = ["right", "center"]; statsGroup.spacing = 15;
    var statW = statsGroup.add("statictext", undefined, t("width") + "-"); var statH = statsGroup.add("statictext", undefined, t("height") + "-"); var statR = statsGroup.add("statictext", undefined, t("ratio") + "-");

    var txtAlert = win.add("statictext", undefined, t("calc")); txtAlert.alignment = ["center", "top"];

    // PANEL PREVIEW (master container)
    var canvasPanel = win.add("panel", undefined, t("preview")); canvasPanel.alignment = ["fill", "fill"]; canvasPanel.alignChildren = ["fill", "fill"]; canvasPanel.margins = 10;
    
    // Change the structure to "stack" using shared horizontal orientation
    var canvasContainer = canvasPanel.add("group"); 
    canvasContainer.orientation = "row"; 
    canvasContainer.alignChildren = ["fill", "fill"]; 
    canvasContainer.alignment = ["fill", "fill"];

    var canvas = canvasContainer.add("group"); canvas.alignment = ["fill", "fill"]; canvas.preferredSize = [450, 220];

    canvas.onDraw = function() {
        var g = this.graphics; var w = this.size[0]; var h = this.size[1]; if (w <= 0 || h <= 0) return;
        var bgB = g.newBrush(g.BrushType.SOLID_COLOR, [0.15, 0.15, 0.18, 1]); g.newPath(); g.rectPath(0, 0, w, h); g.fillPath(bgB);
        var scl = Math.min((w - 30) / docWidthPts, (h - 30) / docHeightPts); var pW = docWidthPts * scl; var pH = docHeightPts * scl;
        var sX = (w - pW) / 2; var sY = (h - pH) / 2;
        var papB = g.newBrush(g.BrushType.SOLID_COLOR, [0.25, 0.25, 0.3, 1]); g.newPath(); g.rectPath(sX, sY, pW, pH); g.fillPath(papB);

        var u = dropUnits.selection.text; var m_p = toPts(state.margins, u); var g_p = toPts(state.gutter, u);
        var m_s = m_p * scl; var g_s = g_p * scl; var gW = pW - (m_s * 2); var gH = pH - (m_s * 2); if (gW <= 0 || gH <= 0) return;
        var cW = (gW - (g_s * (state.cols - 1))) / state.cols; var rH = (gH - (g_s * (state.rows - 1))) / state.rows;

        var pLn = g.newPen(g.PenType.SOLID_COLOR, [0.4, 0.7, 1, 0.6], 1); var pAct = g.newPen(g.PenType.SOLID_COLOR, [0.9, 0.9, 1, 1], 2); var bAct = g.newBrush(g.BrushType.SOLID_COLOR, [0.4, 0.7, 1, 0.2]);

        for (var r = 0; r < state.rows; r++) {
            for (var c = 0; c < state.cols; c++) {
                var modX = sX + m_s + (c * (cW + g_s)); var modY = sY + m_s + (r * (rH + g_s));
                g.newPath(); g.rectPath(modX, modY, cW, rH); g.strokePath(pLn);
                if (r === 0 && c === 0) { g.fillPath(bAct); g.strokePath(pAct); }
            }
        }
    };

    // --- FLOATING ZOOM CONTROLS IN THE RIGHT CORNER, VERTICALLY ALIGNED ---
    var zoomControllerGroup = canvasContainer.add("group");
    zoomControllerGroup.orientation = "column";
    zoomControllerGroup.alignChildren = ["center", "bottom"]; // Alineación vertical pegada al piso
    zoomControllerGroup.alignment = ["right", "fill"];
    zoomControllerGroup.spacing = 4;
    zoomControllerGroup.maximumSize.width = 30;

    var btnZoomIn = zoomControllerGroup.add("button", undefined, "");
    btnZoomIn.preferredSize = [24, 24];
    btnZoomIn.helpTip = "Aumentar área de visualización";
    btnZoomIn.onDraw = function() {
        var g = this.graphics; var w = this.size[0]; var h = this.size[1];
        var bg = g.newBrush(g.BrushType.SOLID_COLOR, [0.22, 0.22, 0.26, 1]); g.newPath(); g.rectPath(0,0,w,h); g.fillPath(bg);
        var pen = g.newPen(g.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 2);
        g.newPath(); g.moveTo(4, h/2); g.lineTo(w-4, h/2); g.moveTo(w/2, 4); g.lineTo(w/2, h-4); g.strokePath(pen);
    };

    var btnZoomOut = zoomControllerGroup.add("button", undefined, "");
    btnZoomOut.preferredSize = [24, 24];
    btnZoomOut.helpTip = "Reducir área de visualización";
    btnZoomOut.onDraw = function() {
        var g = this.graphics; var w = this.size[0]; var h = this.size[1];
        var bg = g.newBrush(g.BrushType.SOLID_COLOR, [0.22, 0.22, 0.26, 1]); g.newPath(); g.rectPath(0,0,w,h); g.fillPath(bg);
        var pen = g.newPen(g.PenType.SOLID_COLOR, [0.9, 0.9, 0.9, 1], 2);
        g.newPath(); g.moveTo(4, h/2); g.lineTo(w-4, h/2); g.strokePath(pen);
    };

    // Elastic logic of zoom buttons with intelligent canvas staggering
    var currentCanvasHeight = 220;
    btnZoomIn.onClick = function() {
        if (currentCanvasHeight < 400) {
            currentCanvasHeight += 45;
            canvas.preferredSize = [450, currentCanvasHeight];
            win.layout.layout(true);
            canvas.hide(); canvas.show();
        }
    };

    btnZoomOut.onClick = function() {
        if (currentCanvasHeight >= 145) {
            currentCanvasHeight -= 45;
            canvas.preferredSize = [450, currentCanvasHeight];
            win.layout.layout(true);
            canvas.hide(); canvas.show();
        }
    };

    // LOWER CONTAINER
    var bottomGroup = win.add("group"); bottomGroup.orientation = "column"; bottomGroup.alignment = ["fill", "bottom"]; bottomGroup.spacing = 10;

    // GALLERY PANEL
    var galleryPanel = bottomGroup.add("panel", undefined, ""); galleryPanel.orientation = "column"; galleryPanel.alignChildren = ["center", "center"]; galleryPanel.margins = [12, 22, 12, 12]; galleryPanel.alignment = ["fill", "top"];
    var galHeaderGroup = galleryPanel.add("group"); galHeaderGroup.orientation = "row"; galHeaderGroup.alignChildren = ["center", "center"]; galHeaderGroup.spacing = 2;
    var lblGallery = galHeaderGroup.add("statictext", undefined, t("galleryTitle"));
    createHelpLink(galHeaderGroup, function() { showHelpDialog(t("helpGalTitle"), t("helpGalText")); });

    var thumbnailsGroup = galleryPanel.add("group"); thumbnailsGroup.orientation = "row"; thumbnailsGroup.spacing = 12; thumbnailsGroup.alignment = ["center", "center"];
    for (var i = 0; i < builtInPresets.length; i++) {
        (function(preset) {
            var itemGroup = thumbnailsGroup.add("group"); itemGroup.orientation = "column"; itemGroup.spacing = 5;
            var btn = itemGroup.add("button", undefined, ""); btn.preferredSize = [65, 65]; btn.helpTip = preset["tip_" + currentLang];
            presetUIButtons.push({ button: btn, presetData: preset });

            btn.onDraw = function() {
                var gr = this.graphics; var bw = this.size[0]; var bh = this.size[1];
                var bgB = gr.newBrush(gr.BrushType.SOLID_COLOR, [0.2, 0.2, 0.25, 1]); gr.newPath(); gr.rectPath(0, 0, bw, bh); gr.fillPath(bgB);
                var p = 6; var gs = 2; var cw = (bw - (p * 2) - (gs * (preset.cols - 1))) / preset.cols; var rh = (bh - (p * 2) - (gs * (preset.rows - 1))) / preset.rows;
                var modB = gr.newBrush(gr.BrushType.SOLID_COLOR, [0.5, 0.8, 1, 0.6]);
                for(var pr = 0; pr < preset.rows; pr++) for(var pc = 0; pc < preset.cols; pc++) {
                    gr.newPath(); gr.rectPath(p + pc * (cw + gs), p + pr * (rh + gs), cw, rh); gr.fillPath(modB);
                }
            };
            itemGroup.add("statictext", undefined, preset.id).graphics.font = ScriptUI.newFont("Tahoma", "Regular", 10);
            btn.onClick = function() {
                var u = dropUnits.selection.text; var minDimPts = Math.min(docWidthPts, docHeightPts); var minDim = fromPts(minDimPts, u);
                var roundUnit = function(v) {
                    if (u === "pt" || u === "px") return Math.round(v);
                    if (u === "cm") return Math.round(v * 10) / 10;
                    if (u === "in") return Math.round(v * 20) / 20;
                    return Math.round(v * 2) / 2;
                };
                var m = roundUnit(minDim * preset.marginR); var g = Math.max(0, roundUnit(minDim * preset.gutterR));

                for (var attempt = 0; attempt < 20; attempt++) {
                    var docW = fromPts(docWidthPts, u); var docH = fromPts(docHeightPts, u);
                    if ((docW - 2*m - (preset.cols-1)*g) / preset.cols > 0 && (docH - 2*m - (preset.rows-1)*g) / preset.rows > 0) break;
                    m = roundUnit(m * 0.8); g = roundUnit(g * 0.8);
                }
                ctrlCols.slider.value = preset.cols; ctrlCols.text.text = preset.cols; ctrlRows.slider.value = preset.rows; ctrlRows.text.text = preset.rows;
                ctrlMarg.slider.value = m; ctrlMarg.text.text = m; ctrlGutt.slider.value = g; ctrlGutt.text.text = g; updateUI();
            };
        })(builtInPresets[i]);
    }

    // SETTINGS PANEL
    var controlsPanel = bottomGroup.add("panel", undefined, t("settings")); controlsPanel.orientation = "column"; controlsPanel.alignChildren = ["fill", "top"]; controlsPanel.margins = [15, 20, 15, 15]; controlsPanel.spacing = 14; controlsPanel.alignment = ["fill", "top"];

    function createSlider(p, min, max, init) {
        var g = p.add("group"); g.orientation = "row"; g.alignChildren = ["fill", "center"]; g.alignment = ["fill", "top"];
        var lbl = g.add("statictext", undefined, ""); lbl.preferredSize.width = 80;
        var sld = g.add("slider", undefined, init, min, max); sld.alignment = ["fill", "center"];
        var txt = g.add("edittext", undefined, init); txt.characters = 4; txt.alignment = ["right", "center"];
        var ctrl = { label: lbl, slider: sld, text: txt };
        // Arrow Up/Down stepping (v1.2). Shift = step by 10.
        txt.addEventListener("keydown", function(ev) {
            if (ev.keyName === "Up" || ev.keyName === "Down") {
                var step = ev.shiftKey ? 10 : 1;
                var cur = Number(txt.text); if (isNaN(cur)) cur = sld.value;
                cur = clamp(cur + (ev.keyName === "Up" ? step : -step), min, max);
                txt.text = cur; sld.value = cur;
                if (typeof updateUI === "function") updateUI();
                ev.preventDefault();
            }
        });
        return ctrl;
    }
    var ctrlCols = createSlider(controlsPanel, RANGES.cols.min, RANGES.cols.max, 4); var ctrlRows = createSlider(controlsPanel, RANGES.rows.min, RANGES.rows.max, 6);
    var ctrlMarg = createSlider(controlsPanel, RANGES.margins.min, RANGES.margins.max, 15); var ctrlGutt = createSlider(controlsPanel, RANGES.gutter.min, RANGES.gutter.max, 5);

    var optGroup = controlsPanel.add("group"); optGroup.alignment = ["fill", "center"]; var chkGuides = optGroup.add("checkbox", undefined, t("chkGuides")); chkGuides.value = true;

    // --- ARTBOARD SCOPE (v1.2) ---
    var abCount = doc.artboards.length;
    var scopeGroup = controlsPanel.add("group"); scopeGroup.orientation = "row"; scopeGroup.alignment = ["fill", "center"]; scopeGroup.alignChildren = ["left", "center"]; scopeGroup.spacing = 6;
    var lblScope = scopeGroup.add("statictext", undefined, t("scope"));
    var dropScope = scopeGroup.add("dropdownlist", undefined, [t("scopeActive"), t("scopeAll"), t("scopeRange")]);
    dropScope.selection = 0;
    createHelpLink(scopeGroup, function() { showHelpDialog(t("helpScopeTitle"), t("helpScopeText")); });
    var txtRange = scopeGroup.add("edittext", undefined, ""); txtRange.characters = 10; txtRange.helpTip = t("rangeHint"); txtRange.enabled = false;
    var lblRangeHint = scopeGroup.add("statictext", undefined, "(" + t("rangeHint") + ")"); lblRangeHint.enabled = false;

    var propGroup = controlsPanel.add("group"); propGroup.alignment = ["fill", "center"];
    var chkProp = propGroup.add("checkbox", undefined, t("proportional")); chkProp.value = true; chkProp.enabled = false;

    // Disable scope controls entirely if the document has a single artboard
    if (abCount <= 1) { dropScope.enabled = false; lblScope.enabled = false; }

    function updateScopeUI() {
        var idx = dropScope.selection ? dropScope.selection.index : 0;
        txtRange.enabled = (idx === 2);
        lblRangeHint.enabled = (idx === 2);
        chkProp.enabled = (idx === 1 || idx === 2);
    }
    dropScope.onChange = function() { updateScopeUI(); };

    var ioGroup = controlsPanel.add("group"); ioGroup.alignment = ["fill", "top"]; ioGroup.orientation = "row"; ioGroup.alignChildren = ["left", "center"]; ioGroup.spacing = 2;
    var lblIO = ioGroup.add("statictext", undefined, t("ioTitle"));
    createHelpLink(ioGroup, function() { showHelpDialog(t("helpIOTitle"), t("helpIOText")); });
    
    var ioElasticSpacer = ioGroup.add("group"); ioElasticSpacer.alignment = ["fill", "center"];
    var btnImport = ioGroup.add("button", undefined, t("btnImport")); var btnExport = ioGroup.add("button", undefined, t("btnExport"));
    btnImport.alignment = ["right", "center"]; btnExport.alignment = ["right", "center"];

    // GENERAL FOOTER
    var footerGroup = bottomGroup.add("group"); footerGroup.alignment = ["fill", "top"]; footerGroup.orientation = "row";

    var aboutCol = footerGroup.add("group"); aboutCol.alignment = ["left", "center"]; aboutCol.orientation = "column"; aboutCol.alignChildren = ["left", "top"]; aboutCol.spacing = 0;
    var lblAbout = aboutCol.add("statictext", undefined, t("btnAbout")); lblAbout.graphics.foregroundColor = lblAbout.graphics.newPen(lblAbout.graphics.PenType.SOLID_COLOR, [0.3, 0.6, 1, 1], 1);
    var underline = aboutCol.add("group"); underline.preferredSize = [45, 1]; underline.alignment = ["left", "top"];
    underline.onDraw = function() {
        var g = this.graphics; g.newPath(); g.rectPath(0, 0, this.size[0], 1); g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [0.3, 0.6, 1, 1]));
    };

    function clickAbout() { showHelpDialog(t("aboutTitle"), t("aboutText")); }
    lblAbout.addEventListener("mousedown", clickAbout); underline.addEventListener("mousedown", clickAbout);

    var btnGroup = footerGroup.add("group"); btnGroup.alignment = ["right", "center"];
    var btnCancel = btnGroup.add("button", undefined, t("cancel"), {name: "cancel"}); var btnOk = btnGroup.add("button", undefined, t("apply"));

    win.onResizing = win.onResize = function() { this.layout.resize(); canvas.hide(); canvas.show(); };

    function updateTextLabels() {
        win.text = t("title"); lblIO.text = t("ioTitle"); btnImport.text = t("btnImport"); btnExport.text = t("btnExport");
        ctrlCols.label.text = t("cols"); ctrlRows.label.text = t("rows"); ctrlMarg.label.text = t("margins"); ctrlGutt.label.text = t("gutter");
        btnCancel.text = t("cancel"); btnOk.text = t("apply"); lblGallery.text = t("galleryTitle"); canvasPanel.text = t("preview"); controlsPanel.text = t("settings");
        chkGuides.text = t("chkGuides"); chkGuides.helpTip = t("helpGuides"); lblAbout.text = t("btnAbout");
        lblScope.text = t("scope"); chkProp.text = t("proportional");
        txtRange.helpTip = t("rangeHint"); lblRangeHint.text = "(" + t("rangeHint") + ")";
        var savedScopeIdx = dropScope.selection ? dropScope.selection.index : 0;
        dropScope.removeAll();
        dropScope.add("item", t("scopeActive")); dropScope.add("item", t("scopeAll")); dropScope.add("item", t("scopeRange"));
        dropScope.selection = savedScopeIdx;
        for (var k = 0; k < presetUIButtons.length; k++) presetUIButtons[k].button.helpTip = presetUIButtons[k].presetData["tip_" + currentLang];
    }

    function updateUI() {
        var u = dropUnits.selection.text; state.cols = Math.round(ctrlCols.slider.value); state.rows = Math.round(ctrlRows.slider.value);
        state.margins = parseFloat(ctrlMarg.slider.value); state.gutter = parseFloat(ctrlGutt.slider.value);
        ctrlCols.text.text = state.cols; ctrlRows.text.text = state.rows; ctrlMarg.text.text = state.margins; ctrlGutt.text.text = state.gutter;
        var m_pts = toPts(state.margins, u); var g_pts = toPts(state.gutter, u);
        var gW = docWidthPts - (m_pts * 2); var gH = docHeightPts - (m_pts * 2);
        if (gW > 0 && gH > 0) {
            var cWp = (gW - (g_pts * (state.cols - 1))) / state.cols; var rHp = (gH - (g_pts * (state.rows - 1))) / state.rows; var rat = cWp / rHp;
            statW.text = t("width") + fromPts(cWp, u).toFixed(2) + " " + u; statH.text = t("height") + fromPts(rHp, u).toFixed(2) + " " + u; statR.text = t("ratio") + rat.toFixed(2);

            var alertColor;
            if (rat > 1.1) { txtAlert.text = t("horizAlert"); alertColor = [0.9, 0.4, 0.4, 1]; } 
            else if (rat < 0.9) { txtAlert.text = t("vertAlert"); alertColor = [0.4, 0.8, 0.4, 1]; } 
            else { txtAlert.text = t("squareAlert"); alertColor = [0.4, 0.7, 1, 1]; }
            txtAlert.graphics.foregroundColor = txtAlert.graphics.newPen(txtAlert.graphics.PenType.SOLID_COLOR, alertColor, 1);
        } else {
            txtAlert.text = t("errorAlert"); txtAlert.graphics.foregroundColor = txtAlert.graphics.newPen(txtAlert.graphics.PenType.SOLID_COLOR, [0.9, 0.4, 0.4, 1], 1);
        }
        canvas.hide(); canvas.show();
    }

    btnExport.onClick = function() {
        var f = File.saveDialog(t("dialogSave"), "*.json");
        if (f) {
            if (!/\.json$/i.test(f.fsName)) { f = new File(f.fsName + ".json"); }
            f.open("w"); f.write('{"cols":'+state.cols+',"rows":'+state.rows+',"margins":'+state.margins+',"gutter":'+state.gutter+',"unit":"'+dropUnits.selection.text+'"}'); f.close();
        }
    };

    btnImport.onClick = function() {
        var f = File.openDialog(t("dialogLoad"), "*.json"); if (!f) return;
        f.open("r"); var content = f.read(); f.close();
        try {
            var p = safeParsePreset(content);
            var clamped = {
                cols:    clamp(Math.round(p.cols),    RANGES.cols.min,    RANGES.cols.max),
                rows:    clamp(Math.round(p.rows),    RANGES.rows.min,    RANGES.rows.max),
                margins: clamp(p.margins,             RANGES.margins.min, RANGES.margins.max),
                gutter:  clamp(p.gutter,              RANGES.gutter.min,  RANGES.gutter.max)
            };
            var unitFound = false;
            for (var j = 0; j < unitNames.length; j++) { if (unitNames[j] === p.unit) { dropUnits.selection = j; unitFound = true; break; } }
            if (!unitFound) throw new Error("Unidad no válida: " + p.unit);

            ctrlCols.slider.value = clamped.cols; ctrlCols.text.text = clamped.cols; ctrlRows.slider.value = clamped.rows; ctrlRows.text.text = clamped.rows;
            ctrlMarg.slider.value = clamped.margins; ctrlMarg.text.text = clamped.margins; ctrlGutt.slider.value = clamped.gutter; ctrlGutt.text.text = clamped.gutter;
            updateUI();
        } catch (e) { alert(t("errParse") + "\n\n" + e.message); }
    };

    dropLang.onChange = function() { currentLang = this.selection.index === 0 ? "es" : "en"; updateTextLabels(); updateUI(); };
    dropUnits.onChange = updateUI; ctrlCols.slider.onChanging = updateUI; ctrlRows.slider.onChanging = updateUI; ctrlMarg.slider.onChanging = updateUI; ctrlGutt.slider.onChanging = updateUI;

    function syncTextToSlider(ctrl, range) {
        var v = Number(ctrl.text.text); if (isNaN(v)) { ctrl.text.text = ctrl.slider.value; return; }
        v = clamp(v, range.min, range.max); ctrl.slider.value = v; ctrl.text.text = v; updateUI();
    }
    ctrlCols.text.onChange = function(){ syncTextToSlider(ctrlCols, RANGES.cols); }; ctrlRows.text.onChange = function(){ syncTextToSlider(ctrlRows, RANGES.rows); };
    ctrlMarg.text.onChange = function(){ syncTextToSlider(ctrlMarg, RANGES.margins); }; ctrlGutt.text.onChange = function(){ syncTextToSlider(ctrlGutt, RANGES.gutter); };

    btnCancel.onClick = function() { app.coordinateSystem = oldCoordinateSystem; win.close(); };

    // Generate grid + guides for a single artboard (v1.2). Returns true if drawn, false if skipped.
    function generateForArtboard(abIndex, useProportional, marginRatio, gutterRatio, mFixed, gFixed, col) {
        doc.artboards.setActiveArtboardIndex(abIndex);
        var b = doc.artboards[abIndex].artboardRect;
        var L = b[0], T = b[1], R = b[2], B = b[3];
        var W = Math.abs(R - L), H = Math.abs(T - B);
        var minDim = Math.min(W, H);
        var m = useProportional ? (marginRatio * minDim) : mFixed;
        var g = useProportional ? (gutterRatio * minDim) : gFixed;

        var gW = W - (m * 2), gH = H - (m * 2);
        if (gW <= 0 || gH <= 0) return false; // margins too large for this artboard; skip it
        var cW = (gW - (g * (state.cols - 1))) / state.cols;
        var rH = (gH - (g * (state.rows - 1))) / state.rows;
        if (cW <= 0 || rH <= 0) return false;

        var tag = "AB" + (abIndex + 1);

        var gridLayer = getOrCreateLayer(t("layerGrid") + " (" + tag + ", " + state.cols + "x" + state.rows + ")");
        for (var r = 0; r < state.rows; r++) for (var c = 0; c < state.cols; c++) {
            var rect = gridLayer.pathItems.rectangle(T - m - (r * (rH + g)), L + m + (c * (cW + g)), cW, rH);
            rect.filled = false; rect.stroked = true; rect.strokeColor = col; rect.strokeWidth = 0.5;
        }
        gridLayer.locked = true;

        if (chkGuides.value) {
            var guidesLayer = getOrCreateLayer(t("layerGuides") + " (" + tag + ")");
            for (var gc = 0; gc < state.cols; gc++) {
                var x = L + m + (gc * (cW + g));
                var l1 = guidesLayer.pathItems.add(); l1.setEntirePath([[x, T], [x, B]]); l1.guides = true;
                var x2 = x + cW; var l2 = guidesLayer.pathItems.add(); l2.setEntirePath([[x2, T], [x2, B]]); l2.guides = true;
            }
            for (var gr = 0; gr < state.rows; gr++) {
                var y = T - m - (gr * (rH + g));
                var h1 = guidesLayer.pathItems.add(); h1.setEntirePath([[L, y], [R, y]]); h1.guides = true;
                var y2 = y - rH; var h2 = guidesLayer.pathItems.add(); h2.setEntirePath([[L, y2], [R, y2]]); h2.guides = true;
            }
            guidesLayer.locked = true;
        }
        return true;
    }

    btnOk.onClick = function() {
        var u = dropUnits.selection.text;
        var m_pts = toPts(state.margins, u), g_pts = toPts(state.gutter, u);

        // Determine target artboards from scope (validate range BEFORE closing the dialog)
        var scopeIdx = dropScope.selection ? dropScope.selection.index : 0;
        var targets;
        if (scopeIdx === 0 || abCount <= 1) {
            targets = [activeABIndex];
        } else if (scopeIdx === 1) {
            targets = []; for (var i = 0; i < abCount; i++) targets.push(i);
        } else {
            var parsed = parseArtboardRange(txtRange.text, abCount);
            if (!parsed.ok) { alert(t("errRange")); return; } // keep dialog open on error
            targets = parsed.indices;
        }

        // Persist all choices for next run (single delimited string for robustness)
        prefSetStr("swissgrid_prefs",
            state.cols + "|" + state.rows + "|" + state.margins + "|" + state.gutter + "|" +
            u + "|" + scopeIdx + "|" + (chkProp.value ? 1 : 0) + "|" + txtRange.text);

        win.close();

        // Proportional ratios derived from the active artboard's dialog values
        var minDimActive = Math.min(docWidthPts, docHeightPts);
        var marginRatio = m_pts / minDimActive, gutterRatio = g_pts / minDimActive;
        // Active scope never scales (uses exact dialog values); All/Range honor the checkbox
        var doProp = (scopeIdx === 0) ? false : chkProp.value;

        var col;
        if (doc.documentColorSpace === DocumentColorSpace.CMYK) {
            col = new CMYKColor(); col.cyan = 100; col.magenta = 0; col.yellow = 0; col.black = 0;
        } else {
            col = new RGBColor(); col.red = 0; col.green = 150; col.blue = 255;
        }

        for (var ti = 0; ti < targets.length; ti++) {
            generateForArtboard(targets[ti], doProp, marginRatio, gutterRatio, m_pts, g_pts, col);
        }

        // Restore the originally active artboard
        doc.artboards.setActiveArtboardIndex(activeABIndex);

        var designLayer;
        try { designLayer = doc.layers.getByName(t("layerDesign")); }
        catch(e) { designLayer = doc.layers.add(); designLayer.name = t("layerDesign"); }
        try { designLayer.move(doc, ElementPlacement.PLACEATBEGINNING); } catch(eMove) {}
        designLayer.locked = false;
        doc.activeLayer = designLayer;
        app.coordinateSystem = oldCoordinateSystem; app.redraw();
    };
    // Restore persisted choices from the previous run (v1.2)
    ;(function () {
      try {
        var blob = prefGetStr("swissgrid_prefs", "");
        if (!blob) return;
        var p = blob.split("|");
        if (p.length < 8) return;
        var pc = parseInt(p[0], 10), pr = parseInt(p[1], 10);
        var pm = Number(p[2]), pg = Number(p[3]);
        var pu = p[4], psc = parseInt(p[5], 10), pp = parseInt(p[6], 10), prg = p[7];
        if (pu) { for (var j = 0; j < unitNames.length; j++) { if (unitNames[j] === pu) { dropUnits.selection = j; break; } } }
        if (!isNaN(pc)) { var vc = clamp(pc, RANGES.cols.min, RANGES.cols.max); ctrlCols.slider.value = vc; ctrlCols.text.text = vc; }
        if (!isNaN(pr)) { var vr = clamp(pr, RANGES.rows.min, RANGES.rows.max); ctrlRows.slider.value = vr; ctrlRows.text.text = vr; }
        if (!isNaN(pm)) { var vm = clamp(pm, RANGES.margins.min, RANGES.margins.max); ctrlMarg.slider.value = vm; ctrlMarg.text.text = vm; }
        if (!isNaN(pg)) { var vg = clamp(pg, RANGES.gutter.min, RANGES.gutter.max); ctrlGutt.slider.value = vg; ctrlGutt.text.text = vg; }
        if (abCount > 1) {
            if (!isNaN(psc) && psc >= 0 && psc <= 2) dropScope.selection = psc;
            chkProp.value = (pp === 1);
            txtRange.text = prg || "";
            updateScopeUI();
        }
      } catch (eRestore) {
        // Corrupt or incompatible saved prefs: clear them and continue with defaults.
        try { app.preferences.setStringPreference("swissgrid_prefs", ""); } catch (e2) {}
      }
    })();

    updateTextLabels(); updateUI(); win.show();
}