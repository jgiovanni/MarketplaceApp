'use strict';

angular.module('ngDreamFactory', [])
    .service('DreamFactory', ['DSP_URL', 'DSP_API_KEY', '$http', '$rootScope',
        function (DSP_URL, DSP_API_KEY, $http, $rootScope) {

            var swaggerInstance = null,
                ApiKeyAuthorization,
                PasswordAuthorization,
                SwaggerApi,
                SwaggerAuthorizations,
                SwaggerHttp,
                SwaggerModel,
                SwaggerModelProperty,
                SwaggerOperation,
                SwaggerRequest,
                SwaggerResource,
                __bind = function (fn, me) {
                    return function () {
                        return fn.apply(me, arguments);
                    };
                },
                ready = false;


                SwaggerApi = (function () {
                    SwaggerApi.prototype.url = "http://api.wordnik.com/v4/resources.json";

                    SwaggerApi.prototype.debug = false;

                    SwaggerApi.prototype.basePath = null;

                    SwaggerApi.prototype.authorizations = null;

                    SwaggerApi.prototype.authorizationScheme = null;

                    SwaggerApi.prototype.info = null;

                    function SwaggerApi(url, options) {
                        if (options == null) {
                            options = {};
                        }
                        if (url) {
                            if (url.url) {
                                options = url;
                            } else {
                                this.url = url;
                            }
                        } else {
                            options = url;
                        }
                        if (options.url != null) {
                            this.url = options.url;
                        }
                        if (options.success != null) {
                            this.success = options.success;
                        }
                        if (options.authorizations != null) {
                            this.authorizations = options.authorizations;
                        }
                        this.failure = options.failure != null ? options.failure : function () {
                        };
                        this.progress = options.progress != null ? options.progress : function () {
                        };
                        if (options.success != null) {

                            this.build();
                        }
                    }

                    SwaggerApi.prototype.build = function () {
                        var obj,
                            _this = this;
                        this.progress('fetching resource list: ' + this.url);
                        obj = {
                            url: this.url,
                            method: "get",
                            headers: {},
                            on: {
                                error: function (response) {
                                    if (_this.url.substring(0, 4) !== 'http') {
                                        return _this.fail('Please specify the protocol for ' + _this.url);
                                    } else if (response.status === 0) {
                                        return _this.fail('Can\'t read from server.  It may not have the appropriate access-control-origin settings.');
                                    } else if (response.status === 404) {
                                        return _this.fail('Can\'t read swagger JSON from ' + _this.url);
                                    } else {
                                        return _this.fail(response.status + ' : ' + response.statusText + ' ' + _this.url);
                                    }
                                },
                                response: function (response) {

                                    _this.swaggerVersion = response.swaggerVersion;
                                    if (_this.swaggerVersion === "1.2") {
                                        return _this.buildFromSpec(response);
                                    } else {
                                        return _this.buildFrom1_1Spec(response);
                                    }
                                }
                            }
                        };
                        /*
                         e = {};
                         if (typeof window !== 'undefined') {
                         e = window;
                         } else {
                         e = exports;
                         }
                         e.authorizations.apply(obj);

                         */

                        _getSwagger().authorizations.apply(obj);
                        new SwaggerHttp().execute(obj);
                        return this;
                    };

                    SwaggerApi.prototype.buildFromSpec = function (response) {
                        var api, isApi, newName, operation, res, resource, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
                        if (response.apiVersion != null) {
                            this.apiVersion = response.apiVersion;
                        }
                        this.apis = {};
                        this.apisArray = [];
                        this.produces = response.produces;
                        this.authSchemes = response.authorizations;
                        if (response.info != null) {
                            this.info = response.info;
                        }
                        isApi = false;
                        _ref = response.apis;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            api = _ref[_i];
                            if (api.operations) {
                                _ref1 = api.operations;
                                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                                    operation = _ref1[_j];
                                    isApi = true;
                                }
                            }
                        }
                        if (response.basePath) {
                            this.basePath = response.basePath;
                        } else if (this.url.indexOf('?') > 0) {
                            this.basePath = this.url.substring(0, this.url.lastIndexOf('?'));
                        } else {
                            this.basePath = this.url;
                        }
                        if (isApi) {
                            newName = response.resourcePath.replace(/\//g, '');
                            this.resourcePath = response.resourcePath;
                            res = new SwaggerResource(response, this);
                            this.apis[newName] = res;
                            this.apisArray.push(res);
                        } else {
                            _ref2 = response.apis;
                            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                                resource = _ref2[_k];
                                res = new SwaggerResource(resource, this);

                                this.apis[res.name] = res;
                                this.apisArray.push(res);
                            }
                        }
                        /*
                        if (this.success) {
                            this.success(this);
                        }
                        return this;
                        */
                    };

                    SwaggerApi.prototype.buildFrom1_1Spec = function (response) {
                        var api, isApi, newName, operation, res, resource, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
                        console.log("This API is using a deprecated version of Swagger!  Please see http://github.com/wordnik/swagger-core/wiki for more info");
                        if (response.apiVersion != null) {
                            this.apiVersion = response.apiVersion;
                        }
                        this.apis = {};
                        this.apisArray = [];
                        this.produces = response.produces;
                        if (response.info != null) {
                            this.info = response.info;
                        }
                        isApi = false;
                        _ref = response.apis;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            api = _ref[_i];
                            if (api.operations) {
                                _ref1 = api.operations;
                                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                                    operation = _ref1[_j];
                                    isApi = true;
                                }
                            }
                        }
                        if (response.basePath) {
                            this.basePath = response.basePath;
                        } else if (this.url.indexOf('?') > 0) {
                            this.basePath = this.url.substring(0, this.url.lastIndexOf('?'));
                        } else {
                            this.basePath = this.url;
                        }
                        if (isApi) {
                            newName = response.resourcePath.replace(/\//g, '');
                            this.resourcePath = response.resourcePath;
                            res = new SwaggerResource(response, this);
                            this.apis[newName] = res;
                            this.apisArray.push(res);
                        } else {
                            _ref2 = response.apis;
                            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                                resource = _ref2[_k];
                                res = new SwaggerResource(resource, this);
                                this.apis[res.name] = res;
                                this.apisArray.push(res);
                            }
                        }



                        if (this.success) {
                            this.success();
                        }
                        return this;

                    };

                    SwaggerApi.prototype.selfReflect = function () {
                        var resource, resource_name, _ref;
                        if (this.apis == null) {
                            return false;
                        }
                        _ref = this.apis;
                        for (resource_name in _ref) {
                            resource = _ref[resource_name];
                            if (resource.ready == null) {
                                return false;
                            }
                        }
                        this.setConsolidatedModels();
                        this.ready = true;
                        if (this.success != null) {
                            return this.success();
                        }
                    };

                    SwaggerApi.prototype.fail = function (message) {
                        this.failure(message);
                        throw message;
                    };

                    SwaggerApi.prototype.setConsolidatedModels = function () {
                        var model, modelName, resource, resource_name, _i, _len, _ref, _ref1, _results;
                        this.modelsArray = [];
                        this.models = {};
                        _ref = this.apis;
                        for (resource_name in _ref) {
                            resource = _ref[resource_name];
                            for (modelName in resource.models) {
                                if (this.models[modelName] == null) {
                                    this.models[modelName] = resource.models[modelName];
                                    this.modelsArray.push(resource.models[modelName]);
                                }
                            }
                        }
                        _ref1 = this.modelsArray;
                        _results = [];
                        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                            model = _ref1[_i];
                            _results.push(model.setReferencedModels(this.models));
                        }
                        return _results;
                    };

                    SwaggerApi.prototype.help = function () {
                        var operation, operation_name, parameter, resource, resource_name, _i, _len, _ref, _ref1, _ref2;
                        _ref = this.apis;
                        for (resource_name in _ref) {
                            resource = _ref[resource_name];
                            console.log(resource_name);
                            _ref1 = resource.operations;
                            for (operation_name in _ref1) {
                                operation = _ref1[operation_name];
                                console.log("  " + operation.nickname);
                                _ref2 = operation.parameters;
                                for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                                    parameter = _ref2[_i];
                                    console.log("    " + parameter.name + (parameter.required ? ' (required)' : '') + " - " + parameter.description);
                                }
                            }
                        }
                        return this;
                    };

                    return SwaggerApi;

                })();


                SwaggerResource = (function () {
                    SwaggerResource.prototype.api = null;

                    SwaggerResource.prototype.produces = null;

                    SwaggerResource.prototype.consumes = null;

                    function SwaggerResource(resourceObj, api) {
                        var consumes, e, obj, parts, produces,
                            _this = this;
                        this.api = api;
                        produces = [];
                        consumes = [];
                        this.path = this.api.resourcePath != null ? this.api.resourcePath : resourceObj.path;
                        this.description = resourceObj.description;
                        parts = this.path.split("/");
                        this.name = parts[parts.length - 1].replace('.{format}', '');
                        this.basePath = this.api.basePath;
                        this.operations = {};
                        this.operationsArray = [];
                        this.modelsArray = [];
                        this.models = {};
                        if ((resourceObj.apis != null) && (this.api.resourcePath != null)) {
                            this.addApiDeclaration(resourceObj);
                        } else {
                            if (this.path == null) {
                                this.api.fail("SwaggerResources must have a path.");
                            }
                            if (this.path.substring(0, 4) === 'http') {
                                this.url = this.path.replace('{format}', 'json');
                            } else {
                                this.url = this.api.basePath + this.path.replace('{format}', 'json');
                            }
                            this.api.progress('fetching resource ' + this.name + ': ' + this.url);
                            obj = {
                                url: this.url,
                                method: "get",
                                headers: {},
                                on: {
                                    error: function (response) {
                                        return _this.api.fail("Unable to read api '" + _this.name + "' from path " + _this.url + " (server returned " + response.statusText + ")");
                                    },
                                    response: function (response) {
                                        return _this.addApiDeclaration(response);
                                    }
                                }
                            };
                            /*
                             e = {};
                             if (typeof window !== 'undefined') {
                             e = window;
                             } else {
                             e = exports;
                             }
                             e.authorizations.apply(obj);
                             */


                            _getSwagger().authorizations.apply(obj);
                            new SwaggerHttp().execute(obj);
                        }
                    }


                    SwaggerResource.prototype.addApiDeclaration = function (response) {
                        var endpoint, _i, _len, _ref;
                        if (response.produces != null) {
                            this.produces = response.produces;
                        }
                        if (response.consumes != null) {
                            this.consumes = response.consumes;
                        }
                        if ((response.basePath != null) && response.basePath.replace(/\s/g, '').length > 0) {
                            this.basePath = response.basePath;
                        }
                        this.addModels(response.models);
                        if (response.apis) {
                            _ref = response.apis;
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                endpoint = _ref[_i];
                                this.addOperations(endpoint.path, endpoint.operations, response.consumes, response.produces);
                            }
                        }
                        this.api[this.name] = this;
                        this.ready = true;
                        return this.api.selfReflect();
                    };

                    SwaggerResource.prototype.addModels = function (models) {
                        var model, modelName, swaggerModel, _i, _len, _ref, _results;
                        if (models != null) {
                            for (modelName in models) {
                                if (this.models[modelName] == null) {
                                    swaggerModel = new SwaggerModel(modelName, models[modelName]);
                                    this.modelsArray.push(swaggerModel);
                                    this.models[modelName] = swaggerModel;
                                }
                            }
                            _ref = this.modelsArray;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                model = _ref[_i];
                                _results.push(model.setReferencedModels(this.models));
                            }
                            return _results;
                        }
                    };

                    SwaggerResource.prototype.addOperations = function (resource_path, ops, consumes, produces) {
                        var method, o, op, ref, responseMessages, type, _i, _len, _results;
                        if (ops) {
                            _results = [];
                            for (_i = 0, _len = ops.length; _i < _len; _i++) {
                                o = ops[_i];
                                consumes = this.consumes;
                                produces = this.produces;
                                if (o.consumes != null) {
                                    consumes = o.consumes;
                                } else {
                                    consumes = this.consumes;
                                }
                                if (o.produces != null) {
                                    produces = o.produces;
                                } else {
                                    produces = this.produces;
                                }
                                type = o.type || o.responseClass;
                                if (type === "array") {
                                    ref = null;
                                    if (o.items) {
                                        ref = o.items["type"] || o.items["$ref"];
                                    }
                                    type = "array[" + ref + "]";
                                }
                                responseMessages = o.responseMessages;
                                method = o.method;
                                if (o.httpMethod) {
                                    method = o.httpMethod;
                                }
                                if (o.supportedContentTypes) {
                                    consumes = o.supportedContentTypes;
                                }
                                if (o.errorResponses) {
                                    responseMessages = o.errorResponses;
                                }
                                o.nickname = this.sanitize(o.nickname);
                                op = new SwaggerOperation(o.nickname, resource_path, method, o.parameters, o.summary, o.notes, type, responseMessages, this, consumes, produces);
                                this.operations[op.nickname] = op;
                                _results.push(this.operationsArray.push(op));
                            }
                            return _results;
                        }
                    };

                    SwaggerResource.prototype.sanitize = function (nickname) {
                        var op;
                        op = nickname.replace(/[\s!@#$%^&*()_+=\[{\]};:<>|./ ?,\\'""-]/g, '_');
                        op = op.replace(/((_){2,})/g, '_');
                        op = op.replace(/^(_)*/g, '');
                        op = op.replace(/([_])*$/g, '');
                        return op;
                    };

                    SwaggerResource.prototype.help = function () {
                        var msg, operation, operation_name, parameter, _i, _len, _ref, _ref1, _results;
                        _ref = this.operations;
                        _results = [];
                        for (operation_name in _ref) {
                            operation = _ref[operation_name];
                            msg = "  " + operation.nickname;
                            _ref1 = operation.parameters;
                            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                                parameter = _ref1[_i];
                                msg.concat("    " + parameter.name + (parameter.required ? ' (required)' : '') + " - " + parameter.description);
                            }
                            _results.push(msg);
                        }
                        return _results;
                    };

                    return SwaggerResource;

                })();

                SwaggerModel = (function () {
                    function SwaggerModel(modelName, obj) {
                        var prop, propertyName, value;
                        this.name = obj.id != null ? obj.id : modelName;
                        this.properties = [];
                        for (propertyName in obj.properties) {
                            if (obj.required != null) {
                                for (value in obj.required) {
                                    if (propertyName === obj.required[value]) {
                                        obj.properties[propertyName].required = true;
                                    }
                                }
                            }
                            prop = new SwaggerModelProperty(propertyName, obj.properties[propertyName]);
                            this.properties.push(prop);
                        }
                    }

                    SwaggerModel.prototype.setReferencedModels = function (allModels) {
                        var prop, type, _i, _len, _ref, _results;
                        _ref = this.properties;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            prop = _ref[_i];
                            type = prop.type || prop.dataType;
                            if (allModels[type] != null) {
                                _results.push(prop.refModel = allModels[type]);
                            } else if ((prop.refDataType != null) && (allModels[prop.refDataType] != null)) {
                                _results.push(prop.refModel = allModels[prop.refDataType]);
                            } else {
                                _results.push(void 0);
                            }
                        }
                        return _results;
                    };

                    SwaggerModel.prototype.getMockSignature = function (modelsToIgnore) {
                        var classClose, classOpen, prop, propertiesStr, returnVal, strong, strongClose, stronger, _i, _j, _len, _len1, _ref, _ref1;
                        propertiesStr = [];
                        _ref = this.properties;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            prop = _ref[_i];
                            propertiesStr.push(prop.toString());
                        }
                        strong = '<span class="strong">';
                        stronger = '<span class="stronger">';
                        strongClose = '</span>';
                        classOpen = strong + this.name + ' {' + strongClose;
                        classClose = strong + '}' + strongClose;
                        returnVal = classOpen + '<div>' + propertiesStr.join(',</div><div>') + '</div>' + classClose;
                        if (!modelsToIgnore) {
                            modelsToIgnore = [];
                        }
                        modelsToIgnore.push(this);
                        _ref1 = this.properties;
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                            prop = _ref1[_j];
                            if ((prop.refModel != null) && (modelsToIgnore.indexOf(prop.refModel)) === -1) {
                                returnVal = returnVal + ('<br>' + prop.refModel.getMockSignature(modelsToIgnore));
                            }
                        }
                        return returnVal;
                    };

                    SwaggerModel.prototype.createJSONSample = function (modelsToIgnore) {
                        var prop, result, _i, _len, _ref;
                        result = {};
                        modelsToIgnore = modelsToIgnore || [];
                        modelsToIgnore.push(this.name);
                        _ref = this.properties;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            prop = _ref[_i];
                            result[prop.name] = prop.getSampleValue(modelsToIgnore);
                        }
                        modelsToIgnore.pop(this.name);
                        return result;
                    };

                    return SwaggerModel;

                })();

                SwaggerModelProperty = (function () {
                    function SwaggerModelProperty(name, obj) {
                        this.name = name;
                        this.dataType = obj.type || obj.dataType || obj["$ref"];
                        this.isCollection = this.dataType && (this.dataType.toLowerCase() === 'array' || this.dataType.toLowerCase() === 'list' || this.dataType.toLowerCase() === 'set');
                        this.descr = obj.description;
                        this.required = obj.required;
                        if (obj.items != null) {
                            if (obj.items.type != null) {
                                this.refDataType = obj.items.type;
                            }
                            if (obj.items.$ref != null) {
                                this.refDataType = obj.items.$ref;
                            }
                        }
                        this.dataTypeWithRef = this.refDataType != null ? this.dataType + '[' + this.refDataType + ']' : this.dataType;
                        if (obj.allowableValues != null) {
                            this.valueType = obj.allowableValues.valueType;
                            this.values = obj.allowableValues.values;
                            if (this.values != null) {
                                this.valuesString = "'" + this.values.join("' or '") + "'";
                            }
                        }
                        if (obj["enum"] != null) {
                            this.valueType = "string";
                            this.values = obj["enum"];
                            if (this.values != null) {
                                this.valueString = "'" + this.values.join("' or '") + "'";
                            }
                        }
                    }

                    SwaggerModelProperty.prototype.getSampleValue = function (modelsToIgnore) {
                        var result;
                        if ((this.refModel != null) && (modelsToIgnore.indexOf(this.refModel.name) === -1)) {
                            result = this.refModel.createJSONSample(modelsToIgnore);
                        } else {
                            if (this.isCollection) {
                                result = this.refDataType;
                            } else {
                                result = this.dataType;
                            }
                        }
                        if (this.isCollection) {
                            return [result];
                        }
                        return result;
                    };

                    SwaggerModelProperty.prototype.toString = function () {
                        var req, str;
                        req = this.required ? 'propReq' : 'propOpt';
                        str = '<span class="propName ' + req + '">' + this.name + '</span> (<span class="propType">' + this.dataTypeWithRef + '</span>';
                        if (!this.required) {
                            str += ', <span class="propOptKey">optional</span>';
                        }
                        str += ')';
                        if (this.values != null) {
                            str += " = <span class='propVals'>['" + this.values.join("' or '") + "']</span>";
                        }
                        if (this.descr != null) {
                            str += ': <span class="propDesc">' + this.descr + '</span>';
                        }
                        return str;
                    };

                    return SwaggerModelProperty;

                })();

                SwaggerOperation = (function () {
                    function SwaggerOperation(nickname, path, method, parameters, summary, notes, type, responseMessages, resource, consumes, produces) {
                        var parameter, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3,
                            _this = this;
                        this.nickname = nickname;
                        this.path = path;
                        this.method = method;
                        this.parameters = parameters != null ? parameters : [];
                        this.summary = summary;
                        this.notes = notes;
                        this.type = type;
                        this.responseMessages = responseMessages;
                        this.resource = resource;
                        this.consumes = consumes;
                        this.produces = produces;
                        this["do"] = __bind(this["do"], this);
                        if (this.nickname == null) {
                            this.resource.api.fail("SwaggerOperations must have a nickname.");
                        }
                        if (this.path == null) {
                            this.resource.api.fail("SwaggerOperation " + nickname + " is missing path.");
                        }
                        if (this.method == null) {
                            this.resource.api.fail("SwaggerOperation " + nickname + " is missing method.");
                        }
                        this.path = this.path.replace('{format}', 'json');
                        this.method = this.method.toLowerCase();
                        this.isGetMethod = this.method === "get";
                        this.resourceName = this.resource.name;
                        if (((_ref = this.type) != null ? _ref.toLowerCase() : void 0) === 'void') {
                            this.type = void 0;
                        }
                        if (this.type != null) {
                            this.responseClassSignature = this.getSignature(this.type, this.resource.models);
                            this.responseSampleJSON = this.getSampleJSON(this.type, this.resource.models);
                        }
                        this.responseMessages = this.responseMessages || [];
                        _ref1 = this.parameters;
                        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                            parameter = _ref1[_i];
                            parameter.name = parameter.name || parameter.type || parameter.dataType;
                            type = parameter.type || parameter.dataType;
                            if (type.toLowerCase() === 'boolean') {
                                parameter.allowableValues = {};
                                parameter.allowableValues.values = ["true", "false"];
                            }
                            parameter.signature = this.getSignature(type, this.resource.models);
                            parameter.sampleJSON = this.getSampleJSON(type, this.resource.models);
                            if (parameter["enum"] != null) {
                                parameter.isList = true;
                                parameter.allowableValues = {};
                                parameter.allowableValues.descriptiveValues = [];
                                _ref2 = parameter["enum"];
                                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                                    v = _ref2[_j];
                                    if ((parameter.defaultValue != null) && parameter.defaultValue === v) {
                                        parameter.allowableValues.descriptiveValues.push({
                                            value: v,
                                            isDefault: true
                                        });
                                    } else {
                                        parameter.allowableValues.descriptiveValues.push({
                                            value: v,
                                            isDefault: false
                                        });
                                    }
                                }
                            }
                            if (parameter.allowableValues != null) {
                                if (parameter.allowableValues.valueType === "RANGE") {
                                    parameter.isRange = true;
                                } else {
                                    parameter.isList = true;
                                }
                                if (parameter.allowableValues.values != null) {
                                    parameter.allowableValues.descriptiveValues = [];
                                    _ref3 = parameter.allowableValues.values;
                                    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                                        v = _ref3[_k];
                                        if ((parameter.defaultValue != null) && parameter.defaultValue === v) {
                                            parameter.allowableValues.descriptiveValues.push({
                                                value: v,
                                                isDefault: true
                                            });
                                        } else {
                                            parameter.allowableValues.descriptiveValues.push({
                                                value: v,
                                                isDefault: false
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        this.resource[this.nickname] = function (args, callback, error) {
                            return _this["do"](args, callback, error);
                        };
                        this.resource[this.nickname].help = function () {
                            return _this.help();
                        };
                    }

                    SwaggerOperation.prototype.isListType = function (type) {
                        if (type.indexOf('[') >= 0) {
                            return type.substring(type.indexOf('[') + 1, type.indexOf(']'));
                        }
                        return void 0;
                    };

                    SwaggerOperation.prototype.getSignature = function (type, models) {
                        var isPrimitive, listType;
                        listType = this.isListType(type);
                        isPrimitive = ((listType != null) && models[listType]) || (models[type] != null) ? false : true;
                        if (isPrimitive) {
                            return type;
                        }
                        if (listType != null) {
                            return models[listType].getMockSignature();
                        }
                        return models[type].getMockSignature();
                        
                    };

                    SwaggerOperation.prototype.getSampleJSON = function (type, models) {
                        var isPrimitive, listType, val;
                        listType = this.isListType(type);
                        isPrimitive = ((listType != null) && models[listType]) || (models[type] != null) ? false : true;
                        val = isPrimitive ? void 0 : (listType != null ? models[listType].createJSONSample() : models[type].createJSONSample());
                        if (val) {
                            val = listType ? [val] : val;
                            return JSON.stringify(val, null, 2);
                        }
                    };

                    SwaggerOperation.prototype["do"] = function (args, opts, callback, error) {
                        var key, param, params, possibleParams, req, requestContentType, responseContentType, value, _i, _len, _ref;
                        if (args == null) {
                            args = {};
                        }
                        if (opts == null) {
                            opts = {};
                        }
                        requestContentType = null;
                        responseContentType = null;
                        if ((typeof args) === "function") {
                            error = opts;
                            callback = args;
                            args = {};
                        }
                        if ((typeof opts) === "function") {
                            error = callback;
                            callback = opts;
                        }
                        if (error == null) {
                            error = function (xhr, textStatus, error) {
                                return console.log(xhr, textStatus, error);
                            };
                        }
                        if (callback == null) {
                            callback = function (data) {
                                var content;
                                content = null;
                                if (data.content != null) {
                                    content = data.content.data;
                                } else {
                                    content = "no data";
                                }
                                return console.log("default callback: " + content);
                            };
                        }
                        params = {};
                        params.headers = [];
                        if (args.headers != null) {
                            params.headers = args.headers;
                            delete args.headers;
                        }
                        _ref = this.parameters;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            param = _ref[_i];
                            if (param.paramType === "header") {
                                if (args[param.name]) {
                                    params.headers[param.name] = args[param.name];
                                }
                            }
                        }
                        if (args.body != null) {
                            params.body = args.body;
                            delete args.body;
                        }
                        possibleParams = (function () {
                            var _j, _len1, _ref1, _results;
                            _ref1 = this.parameters;
                            _results = [];
                            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                                param = _ref1[_j];
                                if (param.paramType === "form" || param.paramType.toLowerCase() === "file") {
                                    _results.push(param);
                                }
                            }
                            return _results;
                        }).call(this);
                        if (possibleParams) {
                            for (key in possibleParams) {
                                value = possibleParams[key];
                                if (args[value.name]) {
                                    params[value.name] = args[value.name];
                                }
                            }
                        }

                        req = new SwaggerRequest(this.method, this.urlify(args), params, opts, callback, error, this)

                        if (opts.mock != null) {
                            return req;
                        }
                        return true;
                    };

                    SwaggerOperation.prototype.pathJson = function () {
                        return this.path.replace("{format}", "json");
                    };

                    SwaggerOperation.prototype.pathXml = function () {
                        return this.path.replace("{format}", "xml");
                    };

                    SwaggerOperation.prototype.urlify = function (args) {
                        var param, queryParams, reg, url, _i, _j, _len, _len1, _ref, _ref1;
                        url = this.resource.basePath + this.pathJson();
                        _ref = this.parameters;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            param = _ref[_i];
                            if (param.paramType === 'path') {
                                if (args[param.name]) {
                                    reg = new RegExp('\{' + param.name + '[^\}]*\}', 'gi');
                                    url = url.replace(reg, encodeURIComponent(args[param.name]));
                                    delete args[param.name];
                                } else {
                                    throw "" + param.name + " is a required path param.";
                                }
                            }
                        }
                        queryParams = "";
                        _ref1 = this.parameters;
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                            param = _ref1[_j];
                            if (param.paramType === 'query') {
                                if (args[param.name]) {
                                    if (queryParams !== "") {
                                        queryParams += "&";
                                    }
                                    queryParams += encodeURIComponent(param.name) + '=' + encodeURIComponent(args[param.name]);
                                }
                            }
                        }
                        if ((queryParams != null) && queryParams.length > 0) {
                            url += "?" + queryParams;
                        }
                        return url;
                    };

                    SwaggerOperation.prototype.supportHeaderParams = function () {
                        return this.resource.api.supportHeaderParams;
                    };

                    SwaggerOperation.prototype.supportedSubmitMethods = function () {
                        return this.resource.api.supportedSubmitMethods;
                    };

                    SwaggerOperation.prototype.getQueryParams = function (args) {
                        return this.getMatchingParams(['query'], args);
                    };

                    SwaggerOperation.prototype.getHeaderParams = function (args) {
                        return this.getMatchingParams(['header'], args);
                    };

                    SwaggerOperation.prototype.getMatchingParams = function (paramTypes, args) {
                        var matchingParams, name, param, value, _i, _len, _ref, _ref1;
                        matchingParams = {};
                        _ref = this.parameters;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            param = _ref[_i];
                            if (args && args[param.name]) {
                                matchingParams[param.name] = args[param.name];
                            }
                        }
                        _ref1 = this.resource.api.headers;
                        for (name in _ref1) {
                            value = _ref1[name];
                            matchingParams[name] = value;
                        }
                        return matchingParams;
                    };

                    SwaggerOperation.prototype.help = function () {
                        var msg, parameter, _i, _len, _ref;
                        msg = "";
                        _ref = this.parameters;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            parameter = _ref[_i];
                            if (msg !== "") {
                                msg += "\n";
                            }
                            msg += "* " + parameter.name + (parameter.required ? ' (required)' : '') + " - " + parameter.description;
                        }
                        return msg;
                    };

                    return SwaggerOperation;

                })();

                SwaggerRequest = (function () {
                    function SwaggerRequest(type, url, params, opts, successCallback, errorCallback, operation, execution) {
                        var body, e, fields, headers, key, myHeaders, name, obj, param, parent, possibleParams, requestContentType, responseContentType, urlEncoded, value, values,
                            _this = this;
                        this.type = type;
                        this.url = url;
                        this.params = params;
                        this.opts = opts;
                        this.successCallback = successCallback;
                        this.errorCallback = errorCallback;
                        this.operation = operation;
                        this.execution = execution;
                        if (this.type == null) {
                            throw "SwaggerRequest type is required (get/post/put/delete).";
                        }
                        if (this.url == null) {
                            throw "SwaggerRequest url is required.";
                        }
                        if (this.successCallback == null) {
                            throw "SwaggerRequest successCallback is required.";
                        }
                        if (this.errorCallback == null) {
                            throw "SwaggerRequest error callback is required.";
                        }
                        if (this.operation == null) {
                            throw "SwaggerRequest operation is required.";
                        }
                        this.type = this.type.toUpperCase();
                        headers = params.headers;
                        myHeaders = {};
                        body = params.body;
                        parent = params["parent"];
                        requestContentType = "application/json";
                        if (body && (this.type === "POST" || this.type === "PUT" || this.type === "PATCH")) {
                            if (this.opts.requestContentType) {
                                requestContentType = this.opts.requestContentType;
                            }
                        } else {
                            if (((function () {
                                var _i, _len, _ref, _results;
                                _ref = this.operation.parameters;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    param = _ref[_i];
                                    if (param.paramType === "form") {
                                        _results.push(param);
                                    }
                                }
                                return _results;
                            }).call(this)).length > 0) {
                                type = param.type || param.dataType;
                                if (((function () {
                                    var _i, _len, _ref, _results;
                                    _ref = this.operation.parameters;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        param = _ref[_i];
                                        if (type.toLowerCase() === "file") {
                                            _results.push(param);
                                        }
                                    }
                                    return _results;
                                }).call(this)).length > 0) {
                                    requestContentType = "multipart/form-data";
                                } else {
                                    requestContentType = "application/x-www-form-urlencoded";
                                }
                            } else if (this.type !== "DELETE") {
                                requestContentType = null;
                            }
                        }
                        if (requestContentType && this.operation.consumes) {
                            if (this.operation.consumes.indexOf(requestContentType) === -1) {
                                console.log("server doesn't consume " + requestContentType + ", try " + JSON.stringify(this.operation.consumes));
                                if (this.requestContentType === null) {
                                    requestContentType = this.operation.consumes[0];
                                }
                            }
                        }
                        responseContentType = null;
                        if (this.type === "POST" || this.type === "GET" || this.type === "PATCH") {
                            if (this.opts.responseContentType) {
                                responseContentType = this.opts.responseContentType;
                            } else {
                                responseContentType = "application/json";
                            }
                        } else {
                            responseContentType = null;
                        }
                        if (responseContentType && this.operation.produces) {
                            if (this.operation.produces.indexOf(responseContentType) === -1) {
                                console.log("server can't produce " + responseContentType);
                            }
                        }
                        if (requestContentType && requestContentType.indexOf("application/x-www-form-urlencoded") === 0) {
                            fields = {};
                            possibleParams = (function () {
                                var _i, _len, _ref, _results;
                                _ref = this.operation.parameters;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    param = _ref[_i];
                                    if (param.paramType === "form") {
                                        _results.push(param);
                                    }
                                }
                                return _results;
                            }).call(this);
                            values = {};
                            for (key in possibleParams) {
                                value = possibleParams[key];
                                if (this.params[value.name]) {
                                    values[value.name] = this.params[value.name];
                                }
                            }
                            urlEncoded = "";
                            for (key in values) {
                                value = values[key];
                                if (urlEncoded !== "") {
                                    urlEncoded += "&";
                                }
                                urlEncoded += encodeURIComponent(key) + '=' + encodeURIComponent(value);
                            }
                            body = urlEncoded;
                        }
                        for (name in headers) {
                            myHeaders[name] = headers[name];
                        }
                        if (requestContentType) {
                            myHeaders["Content-Type"] = requestContentType;
                        }
                        if (responseContentType) {
                            myHeaders["Accept"] = responseContentType;
                        }
                        if (!((headers != null) && (headers.mock != null))) {

                            // var defer = $q.defer();

                            obj = {
                                url: this.url,
                                method: this.type,
                                headers: myHeaders,
                                body: body,
                                on: {
                                    error: function (response) {
                                        return _this.errorCallback(response, _this.opts.parent);
                                    },
                                    redirect: function (response) {
                                        return _this.successCallback(response, _this.opts.parent);
                                    },
                                    307: function (response) {
                                        return _this.successCallback(response, _this.opts.parent);
                                    },
                                    response: function (response) {

                                        //return _this.successCallback(response.content.data, _this.opts.parent);

                                        return _this.successCallback(response, _this.opts.parent);

                                    }
                                }
                            };

                            /*
                             e = {};
                             if (typeof window !== 'undefined') {
                             e = window;
                             } else {
                             e = exports;
                             }
                             e.authorizations.apply(obj);
                             */

                            _getSwagger().authorizations.apply(obj)

                            if (opts.mock == null) {
                                new SwaggerHttp().execute(obj);
                            } else {
                                return obj;
                            }
                        }
                    }

                    SwaggerRequest.prototype.asCurl = function () {
                        var header_args, k, v;
                        header_args = (function () {
                            var _ref, _results;
                            _ref = this.headers;
                            _results = [];
                            for (k in _ref) {
                                v = _ref[k];
                                _results.push("--header \"" + k + ": " + v + "\"");
                            }
                            return _results;
                        }).call(this);
                        return "curl " + (header_args.join(" ")) + " " + this.url;
                    };

                    return SwaggerRequest;

                })();

                SwaggerHttp = (function () {

                    function SwaggerHttp() {
                    }

                    /*

                     SwaggerHttp.prototype.Shred = null;

                     SwaggerHttp.prototype.shred = null;

                     SwaggerHttp.prototype.content = null;

                     function SwaggerHttp() {
                     var parser, stringify,
                     _this = this;
                     if (typeof window !== 'undefined') {
                     this.Shred = require("./shred");
                     } else {
                     this.Shred = require("shred");
                     }
                     this.shred = new this.Shred();
                     parser = function (x) {
                     return JSON.parse(x.toString());
                     };
                     stringify = function (x) {
                     return JSON.stringify(x);
                     };
                     if (typeof window !== 'undefined') {
                     this.content = require("./shred/content");
                     this.content.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
                     parser: parser,
                     stringify: stringify
                     });
                     } else {
                     this.Shred.registerProcessor(["application/json; charset=utf-8", "application/json", "json"], {
                     parser: parser,
                     stringify: stringify
                     });
                     }
                     }
                     */

                    SwaggerHttp.prototype.execute = function (obj) {
                        //return this.shred.request(obj)

                        return $http({
                            method: obj.method,
                            url: obj.url,
                            headers: obj.headers,
                            data: obj.body
                        })
                            .success(function (data) {

                                return obj.on.response(data);
                            })
                            .error(function (error) {

                                return obj.on.error(error);
                            });

                    };

                    return SwaggerHttp;

                })();

                SwaggerAuthorizations = (function () {
                    SwaggerAuthorizations.prototype.authz = null;

                    function SwaggerAuthorizations() {
                        this.authz = {};
                    }

                    SwaggerAuthorizations.prototype.add = function (name, auth) {
                        this.authz[name] = auth;
                        return auth;
                    };

                    SwaggerAuthorizations.prototype.apply = function (obj) {
                        var key, value, _ref, _results;
                        _ref = this.authz;
                        _results = [];
                        for (key in _ref) {
                            value = _ref[key];
                            _results.push(value.apply(obj));
                        }
                        return _results;
                    };

                    return SwaggerAuthorizations;

                })();

                ApiKeyAuthorization = (function () {
                    ApiKeyAuthorization.prototype.type = null;

                    ApiKeyAuthorization.prototype.name = null;

                    ApiKeyAuthorization.prototype.value = null;

                    function ApiKeyAuthorization(name, value, type) {
                        this.name = name;
                        this.value = value;
                        this.type = type;
                    }

                    ApiKeyAuthorization.prototype.apply = function (obj) {
                        if (this.type === "query") {
                            if (obj.url.indexOf('?') > 0) {
                                obj.url = obj.url + "&" + this.name + "=" + this.value;
                            } else {
                                obj.url = obj.url + "?" + this.name + "=" + this.value;
                            }
                            return true;
                        } else if (this.type === "header") {
                            return obj.headers[this.name] = this.value;
                        }
                    };

                    return ApiKeyAuthorization;

                })();

                PasswordAuthorization = (function () {
                    PasswordAuthorization.prototype.name = null;

                    PasswordAuthorization.prototype.username = null;

                    PasswordAuthorization.prototype.password = null;

                    function PasswordAuthorization(name, username, password) {
                        this.name = name;
                        this.username = username;
                        this.password = password;
                    }

                    PasswordAuthorization.prototype.apply = function (obj) {
                        return obj.headers["Authorization"] = "Basic " + btoa(this.username + ":" + this.password);
                    };

                    return PasswordAuthorization;

                })();




            function _setSwagger(swaggerObj) {

                swaggerInstance = swaggerObj;
            }

            function _getSwaggerInit() {
                return  {
                    ApiKeyAuthorization: ApiKeyAuthorization,
                    PasswordAuthorization: PasswordAuthorization,
                    SwaggerApi: SwaggerApi,
                    SwaggerAuthorizations: SwaggerAuthorizations,
                    SwaggerHttp: SwaggerHttp,
                    SwaggerModel: SwaggerModel,
                    SwaggerModelProperty: SwaggerModelProperty,
                    SwaggerOperation: SwaggerOperation,
                    SwaggerRequest: SwaggerRequest,
                    SwaggerResource: SwaggerResource
                }
            }

            function _getSwagger() {

                return swaggerInstance;
            }

            function _isReady() {
                return ready;
            }

            function _setReady(readyBool) {
                ready = readyBool;
            }


            return {

                dspUrl: DSP_URL,
                dspApiKey: DSP_API_KEY,
                supportedSubmitMethods: ['get', 'post', 'put', 'patch', 'merge', 'delete'],
                api: {},
                isReady: function() {
                    return _isReady();
                },
                swaggerInit: function () {

                    this.api = _getSwaggerInit();
                    this.api['authorizations'] = new this.api.SwaggerAuthorizations;
                    this.api.authorizations.add("X-DreamFactory-Application-Name", new this.api.ApiKeyAuthorization("X-DreamFactory-Application-Name", this.dspApiKey, "header"));
                    this.api.authorizations.add('Content-Type', new this.api.ApiKeyAuthorization('Content-Type', 'application/json', 'header'));
                    _setSwagger(this.api);

                    this.api = new this.api.SwaggerApi({
                        url: this.dspUrl + '/rest/api_docs',
                        supportedSubmitMethods: this.supportedSubmitMethods,
                        success: function () {
                            _setReady(true);
                            $rootScope.$broadcast('api:ready');
                        },
                        error: function () {
                            // Handle Errors

                        }
                    });
                }
            }
        }])
    .run(['DreamFactory', function (DreamFactory) {
        DreamFactory.swaggerInit();
    }]);
