/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const lat = 10.419;\r\n    const lng = -75.5383;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);\r\n\r\n    const filtros = { categoria: '', precio: '' }\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n    let properties = [];\r\n\r\n    const categoriasSelect = document.querySelector('#categorias');\r\n    const preciosSelect = document.querySelector('#precios');\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    // Filtrado de categorias y precios\r\n    categoriasSelect.addEventListener('change', e => {\r\n        filtros.categoria = +e.target.value;\r\n        filtrarProperties();\r\n    });\r\n\r\n    preciosSelect.addEventListener('change', e => {\r\n        filtros.precio = +e.target.value;\r\n        filtrarProperties();\r\n    });\r\n\r\n    const getProperties = async () => {\r\n        try {\r\n            const url = '/api/properties';\r\n            const response = await fetch(url);\r\n            properties = await response.json();\r\n\r\n            viewProperties(properties);\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    const viewProperties = properties => {\r\n\r\n        // Limpiar markets previos\r\n        markers.clearLayers();\r\n        \r\n        properties.forEach(propertie => {\r\n            // Agregar los pines\r\n            const marker = new L.marker([propertie?.lat, propertie?.lng], {\r\n                autoPan: true,\r\n            }).addTo(mapa).bindPopup(`\r\n                <p class=\"text-blue-600 font-bold\">${propertie.categoria.name}</p>\r\n                <h1 class=\"text-xl font-extrabold uppercase my-3\">${propertie?.title}</h1>\r\n                <img src=\"/uploads/${propertie.imagen}\" alt=\"Imagen de la propiedad ${propertie.title}\" />\r\n                <p class=\"text-gray-600 font-bold\">${propertie.precio.name}</p>\r\n                <a href=\"/properties/${propertie.id}\" class=\"bg-blue-600 block p-2 text-center font-bold uppercase text-white\">Ver Propiedad</a>\r\n            `);\r\n\r\n            markers.addLayer(marker);\r\n        });\r\n    }\r\n\r\n    const filtrarProperties = () => {\r\n        const result = properties.filter(filtrarByCategoria).filter(filtrarByPrecio);\r\n        viewProperties(result);\r\n    }\r\n\r\n    const filtrarByCategoria = propertie => filtros.categoria ? propertie.categoryId === filtros.categoria : propertie;\r\n    const filtrarByPrecio = propertie => filtros.precio ? propertie.priceId === filtros.precio : propertie;\r\n\r\n    getProperties();\r\n})();\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;