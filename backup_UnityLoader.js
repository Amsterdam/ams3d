function CompatibilityCheck() {
    hasWebGL ? mobile ? confirm("Please note that Unity WebGL is not currently supported on mobiles. Press Ok if you wish to continue anyway.") || window.history.back() : -1 == browser.indexOf("Firefox") && -1 == browser.indexOf("Chrome") && -1 == browser.indexOf("Safari") && (confirm("Please note that your browser is not currently supported for this Unity WebGL content. Try installing Firefox, or press Ok if you wish to continue anyway.") || window.history.back()) : (alert("You need a browser which supports WebGL to run this content. Try installing Firefox."), 
    window.history.back());
}

function SetFullscreen(a) {
    if ("undefined" == typeof JSEvents) return void console.log("Player not loaded yet.");
    var b = JSEvents.canPerformEventHandlerRequests;
    JSEvents.canPerformEventHandlerRequests = function() {
        return 1;
    }, Module.cwrap("SetFullscreen", "void", [ "number" ])(a), JSEvents.canPerformEventHandlerRequests = b;
}

function LoadJSCodeBlob(a, b) {
    var c = document.createElement("script");
    c.src = URL.createObjectURL(a), c.onload = b, document.body.appendChild(c);
}

function LoadJSCode(a, b) {
    var c = new Blob([ a ], {
        type: "text/javascript"
    });
    if (Math.fround && -1 == browser.indexOf("Chrome")) LoadJSCodeBlob(c, b); else {
        console.log("optimizing out Math.fround calls");
        var d = new FileReader();
        d.onload = function(a) {
            var c = a.target.result.replace(/Math_fround\(/g, "("), d = new Blob([ c ], {
                type: "text/javascript"
            });
            LoadJSCodeBlob(d, b);
        }, d.readAsText(c);
    }
}

function DecompressAndLoadFile(a, b, c) {
    tryServerCompression = !1, a += "gz";
    var d = new XMLHttpRequest();
    d.open("GET", a, !0), d.onprogress = c, d.responseType = "arraybuffer", d.onload = function() {
        var c = new Uint8Array(d.response), e = new Date().getTime(), f = pako.inflate(c), g = new Date().getTime();
        console.log("Decompressed " + a + " in " + (g - e) + "ms. You can remove this delay if you configure your web server to host files using gzip compression."), 
        b(f);
    }, d.send(null);
}

function LoadCompressedFile(a, b, c) {
    if (CompressionState.current == CompressionState.Unsupported) return void DecompressAndLoadFile(a, b);
    if (CompressionState.current == CompressionState.Pending) return void CompressionState.pendingServerRequests.push(function() {
        LoadCompressedFile(a, b, c);
    });
    CompressionState.current == CompressionState.Uninitialized && (CompressionState.current = CompressionState.Pending);
    var d = new XMLHttpRequest();
    d.open("GET", a, !0), d.responseType = "arraybuffer", d.onprogress = function(a) {
        c && c(a), CompressionState.current == CompressionState.Pending && (0 == d.status || 200 == d.status ? CompressionState.Set(CompressionState.Supported) : CompressionState.Set(CompressionState.Unsupported));
    }, d.onload = function() {
        if (0 == d.status || 200 == d.status) {
            CompressionState.Set(CompressionState.Supported);
            var e = new Uint8Array(d.response);
            b(e);
        } else CompressionState.Set(CompressionState.Unsupported), DecompressAndLoadFile(a, b, c);
    }, d.onerror = function() {
        CompressionState.Set(CompressionState.Unsupported), DecompressAndLoadFile(a, b, c);
    };
    try {
        d.send(null);
    } catch (e) {
        CompressionState.Set(CompressionState.Unsupported), DecompressAndLoadFile(a, b, c);
    }
}

function LoadCompressedJS(a, b) {
    LoadCompressedFile(a, function(a) {
        LoadJSCode(a, b);
    });
}

function fetchRemotePackageWrapper(a, b, c, d) {
    LoadCompressedFile(a, c, function(c) {
        var d = a, e = b;
        if (c.total && (e = c.total), c.loaded) {
            Module.dataFileDownloads || (Module.dataFileDownloads = {}), Module.dataFileDownloads[d] = {
                loaded: c.loaded,
                total: e
            };
            var f = 0, g = 0, h = 0;
            for (var i in Module.dataFileDownloads) {
                var j = Module.dataFileDownloads[i];
                f += j.total, g += j.loaded, h++;
            }
            f = Math.ceil(f * Module.expectedDataFileDownloads / h), Module.setStatus && Module.setStatus("Downloading data... (" + g + "/" + f + ")");
        } else Module.dataFileDownloads || Module.setStatus && Module.setStatus("Downloading data...");
    });
}

var browser = function() {
    var a, b = navigator.userAgent, c = b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    return /trident/i.test(c[1]) ? (a = /\brv[ :]+(\d+)/g.exec(b) || [], "IE " + (a[1] || "")) : "Chrome" === c[1] && (a = b.match(/\bOPR\/(\d+)/), 
    null != a) ? "Opera " + a[1] : (c = c[2] ? [ c[1], c[2] ] : [ navigator.appName, navigator.appVersion, "-?" ], 
    null != (a = b.match(/version\/(\d+)/i)) && c.splice(1, 1, a[1]), c.join(" "));
}(), hasWebGL = function() {
    if (!window.WebGLRenderingContext) return 0;
    var a = document.createElement("canvas"), b = a.getContext("webgl");
    return b || (b = a.getContext("experimental-webgl")) ? 1 : 0;
}(), mobile = function(a) {
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
}(navigator.userAgent || navigator.vendor || window.opera);

Module.compatibilitycheck ? Module.compatibilitycheck() : CompatibilityCheck();

var didShowErrorMessage = !1;

"function" != typeof window.onerror && (window.onerror = function(a, b, c) {
    return Module.errorhandler && Module.errorhandler(a, b, c) || (console.log("Invoking error handler due to\n" + a), 
    "function" == typeof dump && dump("Invoking error handler due to\n" + a), didShowErrorMessage || -1 != a.indexOf("UnknownError") || -1 != a.indexOf("Program terminated with exit(0)")) ? void 0 : (didShowErrorMessage = !0, 
    -1 != a.indexOf("DISABLE_EXCEPTION_CATCHING") ? void alert("An exception has occured, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project's WebGL player settings to be able to catch the exception or see the stack trace.") : -1 != a.indexOf("Cannot enlarge memory arrays") ? void alert("Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.") : -1 != a.indexOf("Invalid array buffer length") || -1 != a.indexOf("out of memory") ? void alert("The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings.") : -1 != a.indexOf("Script error.") && 0 == document.URL.indexOf("file:") ? void alert("It seems your browser does not support running Unity WebGL content from file:// urls. Please upload it to an http server, or try a different browser.") : void alert("An error occured running the Unity content on this page. See your browser's JavaScript console for more info. The error was:\n" + a));
}), Module.locateFile = function(a) {
    return Module.dataUrl;
}, Module.preRun = [], Module.postRun = [], Module.print = function() {
    return function(a) {
        console.log(a);
    };
}(), Module.printErr = function(a) {
    console.error(a);
}, Module.canvas = document.getElementById("canvas"), Module.progress = null, Module.setStatus = function(a) {
    if (null == this.progress) {
        if ("function" != typeof UnityProgress) return;
        this.progress = new UnityProgress(canvas);
    }
    if (Module.setStatus.last || (Module.setStatus.last = {
        time: Date.now(),
        text: ""
    }), a !== Module.setStatus.text) {
        this.progress.SetMessage(a);
        var b = a.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
        b && this.progress.SetProgress(parseInt(b[2]) / parseInt(b[4])), "" === a && this.progress.Clear();
    }
}, Module.totalDependencies = 0, Module.monitorRunDependencies = function(a) {
    this.totalDependencies = Math.max(this.totalDependencies, a), Module.setStatus(a ? "Preparing... (" + (this.totalDependencies - a) + "/" + this.totalDependencies + ")" : "All downloads complete.");
}, Module.setStatus("Downloading (0.0/1)");

var CompressionState = {
    Uninitialized: 0,
    Pending: 1,
    Unsupported: 2,
    Supported: 3,
    current: 0,
    pendingServerRequests: [],
    Set: function(a) {
        if (CompressionState.current == CompressionState.Pending) {
            CompressionState.current = a;
            for (var b = 0; b < CompressionState.pendingServerRequests.length; b++) CompressionState.pendingServerRequests[b]();
        }
    }
};

Module.memoryInitializerRequest = {
    response: null,
    callback: null,
    addEventListener: function(a, b) {
        if ("load" != a) throw "Unexpected type " + a;
        this.callback = b;
    }
}, LoadCompressedJS(Module.codeUrl), LoadCompressedFile(Module.memUrl, function(a) {
    Module.memoryInitializerRequest.response = a, Module.memoryInitializerRequest.callback && Module.memoryInitializerRequest.callback();
}), function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        b.pako = a();
    }
}(function() {});


var Module;

"undefined" == typeof Module && (Module = eval("(function() { try { return Module || {} } catch(e) { return {} } })()")), 
Module.expectedDataFileDownloads || (Module.expectedDataFileDownloads = 0, Module.finishedDataFileDownloads = 0), 
Module.expectedDataFileDownloads++, function() {
    var a = function(a) {
        function b(a) {
            console.error("package error:", a);
        }
        function c() {
            function a(a, b) {
                if (!a) throw b + new Error().stack;
            }
            function b(a, b, c, d) {
                this.start = a, this.end = b, this.crunched = c, this.audio = d;
            }
            function c(c) {
                Module.finishedDataFileDownloads++, a(c, "Loading data file failed.");
                var d = new Uint8Array(c);
                b.prototype.byteArray = d, b.prototype.requests["/data.unity3d"].onload(), b.prototype.requests["/methods_pointedto_by_uievents.xml"].onload(), 
                b.prototype.requests["/preserved_derived_types.xml"].onload(), b.prototype.requests["/Il2CppData/Metadata/global-metadata.dat"].onload(), 
                b.prototype.requests["/Resources/unity_default_resources"].onload(), b.prototype.requests["/Managed/mono/2.0/machine.config"].onload(), 
                Module.removeRunDependency("datafile_run.data");
            }
            Module.FS_createPath("/", "Il2CppData", !0, !0), Module.FS_createPath("/Il2CppData", "Metadata", !0, !0), 
            Module.FS_createPath("/", "Resources", !0, !0), Module.FS_createPath("/", "Managed", !0, !0), 
            Module.FS_createPath("/Managed", "mono", !0, !0), Module.FS_createPath("/Managed/mono", "2.0", !0, !0), 
            b.prototype = {
                requests: {},
                open: function(a, b) {
                    this.name = b, this.requests[b] = this, Module.addRunDependency("fp " + this.name);
                },
                send: function() {},
                onload: function() {
                    var a = this.byteArray.subarray(this.start, this.end);
                    this.finish(a);
                },
                finish: function(a) {
                    var b = this;
                    Module.FS_createPreloadedFile(this.name, null, a, !0, !0, function() {
                        Module.removeRunDependency("fp " + b.name);
                    }, function() {
                        b.audio ? Module.removeRunDependency("fp " + b.name) : Module.printErr("Preloading file " + b.name + " failed");
                    }, !1, !0), this.requests[this.name] = null;
                }
            }, new b(0, 471729, 0, 0).open("GET", "/data.unity3d"), new b(471729, 471748, 0, 0).open("GET", "/methods_pointedto_by_uievents.xml"), 
            new b(471748, 471864, 0, 0).open("GET", "/preserved_derived_types.xml"), new b(471864, 1925448, 0, 0).open("GET", "/Il2CppData/Metadata/global-metadata.dat"), 
            new b(1925448, 3421508, 0, 0).open("GET", "/Resources/unity_default_resources"), 
            new b(3421508, 3449133, 0, 0).open("GET", "/Managed/mono/2.0/machine.config"), Module.addRunDependency("datafile_run.data"), 
            Module.preloadResults || (Module.preloadResults = {}), Module.preloadResults[e] = {
                fromCache: !1
            }, i ? (c(i), i = null) : j = c;
        }
        var d;
        if ("object" == typeof window) d = window.encodeURIComponent(window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/"); else {
            if ("undefined" == typeof location) throw "using preloaded data can only be done on a web page or in a web worker";
            d = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/");
        }
        var e = "run.data", f = "run.data";
        "function" != typeof Module.locateFilePackage || Module.locateFile || (Module.locateFile = Module.locateFilePackage, 
        Module.printErr("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)"));
        var g = "function" == typeof Module.locateFile ? Module.locateFile(f) : (Module.filePackagePrefixURL || "") + f, h = 3449133, i = null, j = null;
        fetchRemotePackageWrapper(g, h, function(a) {
            j ? (j(a), j = null) : i = a;
        }, b), Module.calledRun ? c() : (Module.preRun || (Module.preRun = []), Module.preRun.push(c));
    };
    a();
}();
