// 結晶3Dビューワー：Three.js で結晶構造を描画し、ミラー指数 (hkl) で結晶面を表示する

const CrystalView = (function () {
  var scene, camera, renderer, controls, canvas;
  var atomGroup, cellGroup, planeGroup, lineGroup;
  var current = null;
  var resized = false;

  function buildScene() {
    canvas = document.getElementById("crystal-canvas");
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10152a);

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.1, 1.8, 2.6);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    var dir2 = new THREE.DirectionalLight(0xffffff, 0.35);
    dir2.position.set(-3, -2, -4);
    scene.add(dir2);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0.5, 0.5, 0.5);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    camera.lookAt(0.5, 0.5, 0.5);

    cellGroup = new THREE.Group();
    atomGroup = new THREE.Group();
    planeGroup = new THREE.Group();
    lineGroup = new THREE.Group();
    scene.add(cellGroup, atomGroup, planeGroup, lineGroup);

    animate();
  }

  function resize() {
    var wrap = document.getElementById("crystal-canvas-wrap");
    var w = wrap.clientWidth, h = wrap.clientHeight;
    if (w < 10 || h < 10) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function animate() {
    requestAnimationFrame(animate);
    var view = document.getElementById("view-crystal3d");
    if (!view.classList.contains("active")) return;
    controls.update();
    renderer.render(scene, camera);
  }

  function clearGroup(g) {
    while (g.children.length) {
      var c = g.children.pop();
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }
  }

  function addCubeWire(group) {
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var edges = new THREE.EdgesGeometry(geo);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x8fa3e8 }));
    line.position.set(0.5, 0.5, 0.5);
    group.add(line);
    geo.dispose();
  }

  function addHexPrismWire(group) {
    var R = 1, C = 1.633;
    var top = [], bot = [];
    for (var i = 0; i < 6; i++) {
      var ang = i * Math.PI / 3;
      top.push(new THREE.Vector3(R * Math.cos(ang), C, R * Math.sin(ang)));
      bot.push(new THREE.Vector3(R * Math.cos(ang), 0, R * Math.sin(ang)));
    }
    var mat = new THREE.LineBasicMaterial({ color: 0x8fa3e8 });
    function ring(pts) {
      var g = new THREE.BufferGeometry().setFromPoints(pts.concat([pts[0]]));
      group.add(new THREE.Line(g, mat));
    }
    ring(top); ring(bot);
    for (var j = 0; j < 6; j++) {
      var g = new THREE.BufferGeometry().setFromPoints([bot[j], top[j]]);
      group.add(new THREE.Line(g, mat));
    }
    return { top: top, bot: bot, C: C, R: R };
  }

  function sphere(pos, radius, color, group) {
    var geo = new THREE.SphereGeometry(radius, 20, 16);
    var mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.1 });
    var m = new THREE.Mesh(geo, mat);
    m.position.copy(pos);
    group.add(m);
    return m;
  }

  function renderCubicStructure(def) {
    addCubeWire(cellGroup);
    var r = 0.09;
    if (def.twoSpecies) {
      def.atomsA.forEach(function (p) { sphere(new THREE.Vector3(p[0], p[1], p[2]), 0.10, 0x3657c9, atomGroup); });
      def.atomsB.forEach(function (p) { sphere(new THREE.Vector3(p[0], p[1], p[2]), 0.145, 0xe8a33d, atomGroup); });
      return;
    }
    (def.atoms || []).forEach(function (p) { sphere(new THREE.Vector3(p[0], p[1], p[2]), r, def.color, atomGroup); });
    if (def.interior) {
      def.interior.forEach(function (p) {
        var center = new THREE.Vector3(p[0], p[1], p[2]);
        sphere(center, r, def.color, atomGroup);
        var neighbors = nearestOf(p, def.atoms, 4);
        neighbors.forEach(function (np) {
          var g = new THREE.BufferGeometry().setFromPoints([center, new THREE.Vector3(np[0], np[1], np[2])]);
          atomGroup.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })));
        });
      });
    }
  }

  function nearestOf(p, candidates, n) {
    var withDist = candidates.map(function (c) {
      var d = Math.pow(c[0] - p[0], 2) + Math.pow(c[1] - p[1], 2) + Math.pow(c[2] - p[2], 2);
      return { c: c, d: d };
    }).sort(function (a, b) { return a.d - b.d; });
    return withDist.slice(0, n).map(function (w) { return w.c; });
  }

  function renderHcpStructure(def) {
    var hex = addHexPrismWire(cellGroup);
    var r = 0.14;
    hex.top.forEach(function (p) { sphere(p, r, def.color, atomGroup); });
    hex.bot.forEach(function (p) { sphere(p, r, def.color, atomGroup); });
    sphere(new THREE.Vector3(0, hex.C, 0), r, def.color, atomGroup);
    sphere(new THREE.Vector3(0, 0, 0), r, def.color, atomGroup);
    var midR = hex.R / Math.sqrt(3);
    [30, 150, 270].forEach(function (deg) {
      var rad = deg * Math.PI / 180;
      sphere(new THREE.Vector3(midR * Math.cos(rad), hex.C / 2, midR * Math.sin(rad)), r, def.color, atomGroup);
    });
  }

  function buildDislocationAtoms(type, coreX) {
    clearGroup(atomGroup); clearGroup(lineGroup);
    var spacing = 0.3, r = 0.08;
    var color = type === "edge" ? 0xc0392b : 0x7a3ec7;
    for (var ix = -4; ix <= 4; ix++) {
      for (var iz = 0; iz < 3; iz++) {
        for (var iy = -3; iy <= 4; iy++) {
          var x = ix, y = iy;
          if (type === "edge" && iy >= 1 && ix > coreX) x = ix + 1;
          if (type === "screw" && iz >= 1 && ix > coreX) y = iy + 1;
          sphere(new THREE.Vector3(x * spacing, y * spacing, iz * spacing), r, color, atomGroup);
        }
      }
    }
    var lineMat = new THREE.LineBasicMaterial({ color: 0xff2d2d });
    var pts;
    if (type === "edge") {
      pts = [new THREE.Vector3(coreX * spacing, 0.5 * spacing, -0.5 * spacing), new THREE.Vector3(coreX * spacing, 0.5 * spacing, 2.5 * spacing)];
    } else {
      pts = [new THREE.Vector3(coreX * spacing, -3.5 * spacing, 0.5 * spacing), new THREE.Vector3(coreX * spacing, 4.5 * spacing, 0.5 * spacing)];
    }
    var lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    lineGroup.add(new THREE.Line(lineGeo, lineMat));
  }

  function renderDislocationModel(def) {
    var coreX = parseFloat(document.getElementById("disloc-x").value);
    buildDislocationAtoms(def.dislocation, coreX);
    var box = new THREE.Box3().setFromObject(atomGroup);
    var center = box.getCenter(new THREE.Vector3());
    var size = box.getSize(new THREE.Vector3());
    var maxDim = Math.max(size.x, size.y, size.z, 0.5);
    controls.target.copy(center);
    camera.position.set(center.x + maxDim * 1.1, center.y + maxDim * 0.9, center.z + maxDim * 1.3);
    camera.lookAt(center);
  }

  function renderStructure(def) {
    clearGroup(cellGroup); clearGroup(atomGroup); clearGroup(planeGroup); clearGroup(lineGroup);
    current = def;
    var discCtl = document.getElementById("dislocation-controls");
    if (def.dislocation) {
      discCtl.style.display = "";
      renderDislocationModel(def);
    } else {
      discCtl.style.display = "none";
      if (def.hex) renderHcpStructure(def);
      else renderCubicStructure(def);
      refitCamera(def);
    }
    updateInfoBox(def);
  }

  function refitCamera(def) {
    var dist = def.hex ? 3.4 : 2.6;
    var targetY = def.hex ? 0.8 : 0.5;
    controls.target.set(0.5, targetY, 0.5);
    camera.position.set(dist * 0.75, dist * 0.6, dist * 0.9);
    camera.lookAt(0.5, targetY, 0.5);
  }

  function updateInfoBox(def) {
    var el = document.getElementById("crystal-info");
    var html = "<dl>";
    html += "<dt>配位数</dt><dd>" + (def.coordination || "—") + "</dd>";
    if (def.packing) html += "<dt>パッキング率</dt><dd>" + def.packing + "</dd>";
    html += "<dt>代表的な物質</dt><dd>" + def.examples + "</dd>";
    html += "<dt>出典</dt><dd>" + def.pages + "</dd>";
    html += "<dt>補足</dt><dd>" + def.note + "</dd>";
    html += "</dl>";
    el.innerHTML = html;

    var millerBtn = document.getElementById("miller-show");
    var note = document.getElementById("miller-presets");
    if (!def.cubic) {
      millerBtn.disabled = true;
      note.innerHTML = '<span class="muted small">' + def.note + '</span>';
    } else {
      millerBtn.disabled = false;
      renderPresets();
    }
  }

  function renderPresets() {
    var el = document.getElementById("miller-presets");
    el.innerHTML = "";
    [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 1, 0]].forEach(function (hkl) {
      var b = document.createElement("button");
      b.className = "chip";
      b.textContent = "(" + hkl.join("") + ")";
      b.addEventListener("click", function () {
        document.getElementById("miller-h").value = hkl[0];
        document.getElementById("miller-k").value = hkl[1];
        document.getElementById("miller-l").value = hkl[2];
        showMillerPlane(hkl[0], hkl[1], hkl[2]);
      });
      el.appendChild(b);
    });
  }

  // ---- ミラー指数 (hkl) の平面を立方体 [0,1]^3 との交差で求める ----
  function showMillerPlane(h, k, l) {
    clearGroup(planeGroup);
    if (h === 0 && k === 0 && l === 0) {
      alert("h, k, l をすべて0にすることはできません。");
      return;
    }
    var n = 1;
    var corners = [];
    for (var x = 0; x <= 1; x++) for (var y = 0; y <= 1; y++) for (var z = 0; z <= 1; z++) corners.push([x, y, z]);
    function f(p) { return h * p[0] + k * p[1] + l * p[2]; }
    var edgesList = [];
    for (var i = 0; i < corners.length; i++) {
      for (var j = i + 1; j < corners.length; j++) {
        var diff = Math.abs(corners[i][0] - corners[j][0]) + Math.abs(corners[i][1] - corners[j][1]) + Math.abs(corners[i][2] - corners[j][2]);
        if (diff === 1) edgesList.push([corners[i], corners[j]]);
      }
    }
    var EPS = 1e-6;
    var pts = [];
    function addPoint(p) {
      for (var a = 0; a < pts.length; a++) {
        if (Math.abs(pts[a][0] - p[0]) < 1e-4 && Math.abs(pts[a][1] - p[1]) < 1e-4 && Math.abs(pts[a][2] - p[2]) < 1e-4) return;
      }
      pts.push(p);
    }
    edgesList.forEach(function (e) {
      var f0 = f(e[0]) - n, f1 = f(e[1]) - n;
      if (Math.abs(f0) < EPS) addPoint(e[0]);
      if (Math.abs(f1) < EPS) addPoint(e[1]);
      if (f0 * f1 < 0) {
        var t = f0 / (f0 - f1);
        addPoint([e[0][0] + t * (e[1][0] - e[0][0]), e[0][1] + t * (e[1][1] - e[0][1]), e[0][2] + t * (e[1][2] - e[0][2])]);
      }
    });
    if (pts.length < 3) {
      document.getElementById("miller-presets").insertAdjacentHTML("afterend",
        '<p class="muted small" id="miller-warn">この面は単位格子の範囲内を通りません。別の指数を試してください。</p>');
      setTimeout(function () { var w = document.getElementById("miller-warn"); if (w) w.remove(); }, 3000);
      return;
    }
    var normal = new THREE.Vector3(h, k, l).normalize();
    var centroid = pts.reduce(function (acc, p) { return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]]; }, [0, 0, 0])
      .map(function (v) { return v / pts.length; });
    var arbitrary = Math.abs(normal.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    var u = new THREE.Vector3().crossVectors(normal, arbitrary).normalize();
    var v = new THREE.Vector3().crossVectors(normal, u).normalize();
    pts.forEach(function (p) { p.angle = Math.atan2(
      (p[0] - centroid[0]) * v.x + (p[1] - centroid[1]) * v.y + (p[2] - centroid[2]) * v.z,
      (p[0] - centroid[0]) * u.x + (p[1] - centroid[1]) * u.y + (p[2] - centroid[2]) * u.z
    ); });
    pts.sort(function (a, b) { return a.angle - b.angle; });

    var shapePts = pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    var geo = new THREE.BufferGeometry();
    var vertices = [];
    for (var idx = 1; idx < shapePts.length - 1; idx++) {
      vertices.push(shapePts[0], shapePts[idx], shapePts[idx + 1]);
    }
    var posArray = [];
    vertices.forEach(function (p) { posArray.push(p.x, p.y, p.z); });
    geo.setAttribute("position", new THREE.Float32BufferAttribute(posArray, 3));
    geo.computeVertexNormals();
    var mat = new THREE.MeshBasicMaterial({ color: 0xff5a5a, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    planeGroup.add(new THREE.Mesh(geo, mat));

    var outline = shapePts.concat([shapePts[0]]);
    var lineGeo = new THREE.BufferGeometry().setFromPoints(outline);
    planeGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xff2d2d })));
  }

  function populateSelect() {
    var sel = document.getElementById("crystal-select");
    CRYSTAL_STRUCTURES.forEach(function (def) {
      var opt = document.createElement("option");
      opt.value = def.id;
      opt.textContent = def.name;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () {
      selectStructure(sel.value);
    });
  }

  function selectStructure(id) {
    var def = CRYSTAL_STRUCTURES.filter(function (d) { return d.id === id; })[0];
    if (!def) return;
    document.getElementById("crystal-select").value = id;
    renderStructure(def);
  }

  function init() {
    buildScene();
    populateSelect();
    selectStructure(CRYSTAL_STRUCTURES[0].id);
    resize();
    window.addEventListener("resize", resize);

    document.getElementById("miller-show").addEventListener("click", function () {
      var h = parseInt(document.getElementById("miller-h").value, 10) || 0;
      var k = parseInt(document.getElementById("miller-k").value, 10) || 0;
      var l = parseInt(document.getElementById("miller-l").value, 10) || 0;
      showMillerPlane(h, k, l);
    });
    document.getElementById("miller-clear").addEventListener("click", function () {
      clearGroup(planeGroup);
    });

    document.getElementById("disloc-x").addEventListener("input", function () {
      document.getElementById("disloc-x-val").textContent = parseFloat(this.value).toFixed(1);
      if (current && current.dislocation) buildDislocationAtoms(current.dislocation, parseFloat(this.value));
    });
  }

  function onShow() {
    resize();
  }

  return { init: init, onShow: onShow, selectStructure: selectStructure };
})();

window.CrystalView = CrystalView;
