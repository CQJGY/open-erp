/**
 * Created by zhangjh on 2015/7/10.
 */
(function ($) {

    "use strict";
    var path = $.basepath();
    var selectURL = path + "/system/sp/select";
    var bom_selectURL = path + "/system/baseinfo/bom_select";
    //var saveFabricFunURL = path + "/development/bom/saveFabricFun";
    var _pantoneSelectURL = path + '/system/pantone/select';
    var title_type = "面料_";
    $.extend({
        initFabric: initFabric,
        buildFabricItems: buildFabricItems,
        turnPantoneInfoToSelectOption: turnPantoneInfoToSelectOption,
        reloadPantoneId: reloadPantoneId,
        refreshAllFabricId: refreshAllFabricId
    });

    /**
     *  根据编号刷新fabricId
     * @param fabrics
     */
    function refreshAllFabricId(fabrics) {
        if (null != fabrics) {
            for (var idx = 0, len = fabrics.length; idx < len; idx++) {
                var fabricInfo = fabrics[idx];
                var fabricId = fabricInfo.fabricId;
                var serialNumber = fabricInfo.serialNumber;
                if (null != fabricId) {
                    $("#fabricId" + serialNumber).val(fabricId);
                }

            }
        }
    }

    /**
     *
     * @returns {{isOneShow: boolean, fabricItems: Array}}
     */
    function buildFabricItems() {
        var size = $("div[id^=fabricAllInfoId]").length;
        var fabricItems = [];
        var isOneShow = false;
        for (var index = 1; index <= size; index++) {
            var fabricItem = buildFabricItem(index);
            var isShow = fabricItem.fabricsInfo.isShow;
            isOneShow = isOneShow || isShow==1;
            fabricItems.push(fabricItem);
        }

        if (fabricItems.length == 0) {
            isOneShow = true;
        }

        var fabricObj = {"isOneShow": isOneShow, "fabricItems": fabricItems};
        return fabricObj;
    }

    /**
     * 切换复合材料
     * @param blcIdVal
     * @param _idNum
     * @param f
     */
    function showOrHideCompositeDiv(blcIdVal, _idNum, callback) {

        if (blcIdVal === blc_type_fuhe) {//复合
            $("#compositeDiv" + _idNum).show();
            $("#tiemoDiv" + _idNum).show();
        }
        else if (blcIdVal === ble_type_tiemo) {//贴膜
            $("#compositeDiv" + _idNum).show();
            $("#tiemoDiv" + _idNum).hide();
        }
        else {
            $("#compositeDiv" + _idNum).hide();
            $("#tiemoDiv" + _idNum).hide();
        }
        callback();

    }


    /**
     *
     * @param materialTypeIdVal
     * @param idNum
     * @param callback
     */
    function reloadSpSelect(materialTypeIdVal, idNum, callback) {
        $.sendRestFulAjax(selectURL, {'keyword': materialTypeIdVal}, 'GET', 'json', function (_data) {
            var spIdField = $("#spId" + idNum);
            spIdField.empty();
            $("<option></option>").val('').text("...请选择...").appendTo(spIdField);
            $.each(_data["items"], function (key, value) {
                $("<option></option>")
                    .val(value["natrualkey"])
                    .text(value["name"])
                    .appendTo(spIdField);
            });

            callback();
        });
    }

    /**
     *
     * @param fabrics
     */
    function initFabric(fabrics) {
        for (var index = 0; index < fabrics.length; index++) {
            addFabric(fabrics[index]);
        }
    }

    /**
     * 启动表单校验监听
     * @param _id 当前表单序号
     */
    var startBootstrapValidatorListner = function (_id) {
        $('#fabricFormId' + _id).bootstrapValidator({
            //live: 'disabled',
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: fieldsDesc
        }).on('success.form.bv', function (e) { //表单校验成功，ajax提交数据
            console.log("面料_" + _id + "验证成功" + e);
            saveFabricFun(_id);
        });
    };

    /**
     * select2的option为{id:id,text:text},所以需要将返回的数据转换需要的格式
     * @param pantoneIdsArr
     * @returns {Array}
     */
    function turnPantoneInfoToSelectOption(pantoneIdsArr) {
        var _pantoneIdsArr = [];
        for (var idx = 0; idx < pantoneIdsArr.length; idx++) {
            var pantone = pantoneIdsArr[idx];
            var _pantone = {};
            _pantone.id = pantone.pantoneId == null ? pantone.id : pantone.pantoneId;
            _pantone.text = pantone.pantoneName == null ? pantone.text : pantone.pantoneName;
            _pantoneIdsArr.push(_pantone);
        }
        return _pantoneIdsArr;
    }

    /**
     * 初始化面料idNum的表单信息
     * @param idNum 面料序号
     * @param _fabricInfo 面料表单值
     */
    function initFabricFields(idNum, _fabricInfo) {

        //保存值
        var fabricInfo = $.extend({}, _fabricInfo);

        bom.fabricItems.push(fabricInfo);

        //初始化赋值
        Object.keys(_fabricInfo).map(function (key) {

            //下拉框
            $("#" + key + idNum).val(_fabricInfo[key]);

            //复合与单布选项特殊处理
            if (key === 'blcId') {
                showOrHideCompositeDiv(_fabricInfo[key], idNum, function () {
                });
            }
            //处理位置多选
            if (key == 'positionIds') {
                //var arr = _fabricInfo[key].split(',');
                var arr = _fabricInfo[key];
                var positionIds = [];
                if (null != arr) {
                    for (var idx = 0, len = arr.length; idx < len; idx++) {
                        positionIds.push(arr[idx].positionId);
                    }
                }
                $('#positionIds' + idNum).selectpicker("val", positionIds);
                //$('#sexIds').val(arr);
            }


        });


        //初始供应商信息
        initSpSelect(idNum, _fabricInfo);

        var pantoneIdsArr = _fabricInfo["pantoneIds"];
        if (pantoneIdsArr != null) {
            var _pantoneIdsArr = turnPantoneInfoToSelectOption(pantoneIdsArr);
            var $id = $('#pantoneIds' + idNum);
            reloadPantoneId($id, _pantoneIdsArr);
        }

        var pantoneIdsArr = _fabricInfo["compositePantoneIds"];
        if (pantoneIdsArr != null) {
            var _pantoneIdsArr = turnPantoneInfoToSelectOption(pantoneIdsArr);
            var $id = $('#compositePantoneIds' + idNum);
            reloadPantoneId($id, _pantoneIdsArr);
        }


    }

    /**
     *初始供应商信息
     * @param idNum
     * @param _fabricInfo
     */
    function initSpSelect(idNum, _fabricInfo) {

        var materialTypeIdVal = $("materialTypeId" + idNum).val();
        var idNum = idNum;
        reloadSpSelect(materialTypeIdVal, idNum, function () {
            $("#spId" + idNum).val(_fabricInfo['spId']);
        });

    }

    /**
     * 添加面料
     */
    var addFabric = function (fabricInfo) {

        //if (fabricInfo == undefined){
        //    fabricInfo = fabric;
        //}

        $("div[id^=fabricAllInfoId]").hide(); //页面加载时，面料全部隐藏

        $("span[id^=fabricEyeId]").removeClass("glyphicon glyphicon-eye-open").addClass("glyphicon glyphicon-eye-close");

        var size = $("div[id^=fabricAllInfoId]").length;

        var idNum = size + 1;

        var data = buildMyTemplateData(idNum);

        var myTemplate = Handlebars.compile($("#fabric-template").html());
        $("#fabricsItemInfo").append(myTemplate(data));

        $("div[id^=fabricAllInfoId]").hide(); //页面加载时，面料全部隐藏
        $("span[id^=fabricEyeId]").removeClass("glyphicon glyphicon-eye-open").addClass("glyphicon glyphicon-eye-close");

        //加载下拉列表数据,
        reloadFabricDetailSelectData(idNum, function () {
            callbackInitFabricFields(idNum, fabricInfo);
        });


    };

    /**
     * 赋初始值
     * @param idNum
     * @param fabricInfo
     */
    var callbackInitFabricFields = function (idNum, fabricInfo) {

        if (fabricInfo != null) {
            initFabricFields(idNum, fabricInfo);
            //表单字段监听
            startBootstrapValidatorListner(idNum);
        } else {
            var $id = $('#pantoneIds' + idNum);
            reloadPantoneId($id, []);
            var $id2 = $('#compositePantoneIds' + idNum);
            reloadPantoneId($id2, []);
        }
    };

    /**
     *
     * @param idNum
     */
    //删除面料
    function deleteFraicById(idNum) {
        bom.fabricItems.splice(idNum - 1, 1);
    }

    /**
     * 克隆面料
     * @param _this
     * @param idNum
     */
    function copyFabric(_this, idNum) {

        var fabricItem = getFabricItem(idNum);
        fabricItem.fabricId = null;
        addFabric(fabricItem);
    }

    /**
     *
     * @param idNum
     */
    var deleteFun = function (idNum) {
        //当前面料id
        var curId = idNum;
        var fabricArrLength = $("div[id^=fabricAllInfoId]").length;
        //删除当前面料和之后的所有面料
        for (var index = curId; index <= fabricArrLength; index++) {
            //$("div[id^=fabricAllInfoId]")
            $("#fabricDivId" + index).remove();
            //保存当前节点之后的数据
            if (index >= curId) {

                if (index == curId) {
                    deleteFraicById(index);
                }


                var formDataStr = $("#fabricFormId" + (index + 1)).serialize();
                if (formDataStr != '') {
                    saveFabricById(index, formDataStr);
                }

            }
        }
        //重新生成面料
        var maxFabricId = fabricArrLength - 1;
        for (var index = curId; index <= maxFabricId; index++) {
            addFabric();
        }

        $("div[id^=fabricAllInfoId]").hide(); //全部隐藏


    };

    /**
     *
     * @param result
     * @param idNum
     */
    var doDel = function (result, idNum) {
        if (result) {
            deleteFun(idNum);
        }
    };

    /**
     *
     * @param _this
     * @param idNum
     */
    var trashFabricSelect = function (_this, idNum) {
        var saveFlag = bom.fabricItems[idNum - 1].saveFlag;
        if (saveFlag == true) {
            bootbox.confirm("面料_" + idNum + "已保存，确定要删除", function (result) {
                doDel(result, idNum);
            });
        }
        else {
            deleteFun(idNum);
        }

    };

    /**
     *
     * @param idNum
     */
    var saveFabricFun = function (idNum) {
        var formDataStr = $("#fabricFormId" + idNum).serialize();
        saveFabricById(idNum, formDataStr);
        bom.fabricItems[idNum - 1].saveFlag = true;//已保存

    };

    /**
     *
     * @param idNum
     * @param formDataStr
     */
    var saveFabricById = function (idNum, formDataStr) {
        var jsonObj = $.strToJson(formDataStr);
        bom.fabricItems[idNum - 1] = jsonObj;
        if (!$("#fabricAllInfoId" + idNum).is(':hidden')) {
            bom.fabricItems[idNum - 1].showFlag = true;//是否显示
        }
        bom.fabricItems[idNum - 1].currenId = idNum;//当前序号
        //$.sendRestFulAjax(saveFabricFunURL, jsonObj, 'GET', 'json', function (data) {
        //    _doFabricSuccess_info(data, idNum);
        //});
    };


    /**
     * 显示或者展示div
     * @param _this
     * @param idNum
     */
    var showOrHideFabric = function (_this, idNum) {
        var fabricEyeId = "#fabricEyeId" + idNum;
        var fabricTrashId = "#fabricTrashId" + idNum;
        $("#fabricAllInfoId" + idNum).toggle(300,
            function () {
                if ($(this).is(':hidden')) {
                    $(fabricEyeId).removeClass("glyphicon glyphicon-eye-open").addClass("glyphicon glyphicon-eye-close");
                    $(fabricTrashId).addClass("disabled");
                }
                else {
                    $(fabricEyeId).removeClass("glyphicon glyphicon-eye-close").addClass("glyphicon glyphicon-eye-open");
                    $(fabricTrashId).removeClass("disabled");
                }
            }
        );
    };

    /**
     * 当后台的基础信息修改后，点击刷新，可以刷新cookies信息
     */
    var refreshFabricSelect = function (_this, idNum) {
        var fabricItem = getFabricItem(idNum);
        reloadBomSelect(idNum, function () {
            initFabricFields(idNum, fabricItem);
        });
        var $id = $('#pantoneIds' + idNum);
        reloadPantoneId($id, fabricItem['pantoneIds']);
    };

    //function initPantoneField(_index, pantoneIdsArr) {
    //    $.initSelect2sByArr('pantoneIds' + _index, 'pantoneId', 'pantoneName', pantoneIdsArr);
    //}

    /**
     * 刷新面料颜色
     * @param index
     * @param _pantoneIds
     */
    function reloadPantoneId(_$id, _pantoneIds) {
        $.select2s(_$id, _pantoneSelectURL, 'Pantone not selected', 'Please, select pantone', function () {
            //console.info("pantoneIdsF:" + _pantoneIds);
            return _pantoneIds;
        });
        //callback();
    }


    /**
     *
     * @param idNum
     * @param callback
     */
    var reloadBomSelect = function (idNum, callback) {
        $.sendRestFulAjax(bom_selectURL, null, 'GET', 'json', function (data) {
            _doFabricSuccess_info(data, idNum, callback);
        });
    };

    /**
     *
     * @param id
     * @param callback
     */
        //第一次初始化下拉列表
    var reloadFabricDetailSelectData = function (id, callback) {
            reloadBomSelect(id, callback);
        };

    /**
     *
     * @param _data
     * @param idNum
     * @param callback
     * @private
     */
        //cookie重新赋值，给下拉列表赋值
    var _doFabricSuccess_info = function (_data, idNum, callback) {
            //$.cookie('systemBaseMaps', JSON.stringify(_data));//JSON 数据转化成字符串
            initFabricSelect(_data, idNum, callback);
        };

    /**
     *
     * @param _data
     * @param _idNum
     * @param callback
     */
        //给下拉列表赋值
    var initFabricSelect = function (_data, _idNum, callback) {
            var idNum = _idNum;
            var data = _data;//JSON.parse($.cookie('systemBaseMaps'));//字符串转化成JSON 数据
            //材料类别
            var materialTypeIdItems = data["materialTypeItems"];
            var $materialTypeId = $("#materialTypeId" + idNum);
            $materialTypeId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($materialTypeId);
            $.each(materialTypeIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($materialTypeId);
            });

            //供应商
            var spItems = data["spItems"];
            var $spId = $("#spId" + idNum);
            $spId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($spId);
            //$.each(spItems, function (i, item) {
            //    $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($(spId));
            //});

            //年份
            var yearCodeItems = data["yearItems"];
            var $yearCode = $("#yearCode" + idNum);
            $yearCode.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($yearCode);
            $.each(yearCodeItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($yearCode);
            });

            //材质列表
            var classicIdItems = data["fabricClassicItems"];
            var $classicId = $("#classicId" + idNum);
            $classicId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($classicId);
            $.each(classicIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($classicId);
            });

            //品名列表
            var productTypeIdItems = data["productTypeItems"];
            var $productTypeId = $("#productTypeId" + idNum);
            $productTypeId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($productTypeId);
            $.each(productTypeIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($productTypeId);
            });

            //纱支密度列表
            var specificationIdItems = data["specficationItems"];
            var $specificationId = $("#specificationId" + idNum);
            $specificationId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($specificationId);
            $.each(specificationIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($specificationId);
            });

            //染色方式列表
            //noinspection JSDuplicatedDeclaration
            var dyeIdItems = data["dyeItems"];
            var $dyeId = $("#dyeId" + idNum);
            $dyeId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($dyeId);
            $.each(dyeIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($dyeId);
            });

            //防泼水列表
            var finishIdItems = data["finishItems"];
            var $finishId = $("#finishId" + idNum);
            $finishId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($finishId);
            $.each(finishIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($finishId);
            });

            //复合或涂层列表
            var blcIdItems = data["blcItems"];
            var $blcId = $("#blcId" + idNum);
            $blcId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($blcId);
            $.each(blcIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($blcId);
            });

            //材质列表-复合
            // var classicIdItems = data["fabricClassicItems"];
            var $compositeClassicId = $("#compositeClassicId" + idNum);
            $compositeClassicId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeClassicId);
            $.each(classicIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeClassicId);
            });

            //品名列表-复合
            // var productTypeIdItems = data["productTypeItems"];
            var $compositeProductTypeId = $("#compositeProductTypeId" + idNum);
            $compositeProductTypeId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeProductTypeId);
            $.each(productTypeIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeProductTypeId);
            });

            //纱支密度列表-复合
            // var specificationIdItems = data["specficationItems"];
            var $compositeSpecificationId = $("#compositeSpecificationId" + idNum);
            $compositeSpecificationId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeSpecificationId);
            $.each(specificationIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeSpecificationId);
            });

            //染色方式列表-复合
            // var dyeIdItems = data["dyeItems"];
            var $compositeDyeId = $("#compositeDyeId" + idNum);
            $compositeDyeId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeDyeId);
            $.each(dyeIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeDyeId);
            });

            //防泼水列表-复合
            // var finishIdItems = data["finishItems"];
            var $compositeFinishId = $("#compositeFinishId" + idNum);
            $compositeFinishId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeFinishId);
            $.each(finishIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeFinishId);
            });

            //膜或涂层的材质列表
            var mcIdItems = data["momcItems"];
            var $momcId = $("#momcId" + idNum);
            $momcId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($momcId);
            $.each(mcIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($momcId);
            });

            //膜或涂层的颜色列表-复合
            var comcIdItems = data["comocItems"];
            var $comocId = $("#comocId" + idNum);
            $comocId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($comocId);
            $.each(comcIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($comocId);
            });

            //透湿列表
            var wvpIdItems = data["wvpItems"];
            var $wvpId = $("#wvpId" + idNum);
            $wvpId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($wvpId);
            $.each(wvpIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($wvpId);
            });

            //透湿列表-复合
            var $compositeWvpId = $("#compositeWvpId" + idNum);
            $compositeWvpId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeWvpId);
            $.each($compositeWvpId, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeWvpId);
            });

            //透湿列表
            var wvpIdItems = data["wvpItems"];
            var $wvpId = $("#wvpId" + idNum);
            $wvpId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($wvpId);
            $.each(wvpIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($wvpId);
            });

            <!---->
            //水压
            var waterProofIdItems = data["jcWaterProofItems"];
            var $waterProofId = $("#waterProofId" + idNum);
            $waterProofId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($waterProofId);
            $.each(waterProofIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($waterProofId);
            });

            //水压-复合
            var $compositeWaterProofId = $("#compositeWaterProofId" + idNum);
            $compositeWaterProofId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeWaterProofId);
            $.each(waterProofIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeWaterProofId);
            });

            //透气
            var permeabilityIdItems = data["airPermeabilityItems"];
            var $permeabilityId = $("#permeabilityId" + idNum);
            $permeabilityId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($permeabilityId);
            $.each(permeabilityIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($permeabilityId);
            });

            //透气-复合
            var $compositePermeabilityId = $("#compositePermeabilityId" + idNum);
            $compositePermeabilityId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositePermeabilityId);
            $.each(permeabilityIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositePermeabilityId);
            });

            //接缝水压
            var waterpressureIdItems = data["jcSeamWaterpressureItems"];
            var $waterpressureId = $("#waterpressureId" + idNum);
            $waterpressureId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($waterpressureId);
            $.each(waterpressureIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($waterpressureId);
            });

            //接缝水压-复合
            var $compositeWaterpressureId = $("#compositeWaterpressureId" + idNum);
            $compositeWaterpressureId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeWaterpressureId);
            $.each(waterpressureIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeWaterpressureId);
            });

            //抗紫外线
            var ultravioletProtectionIdItems = data["jcUltravioletProtectionItems"];
            var $ultravioletProtectionId = $("#ultravioletProtectionId" + idNum);
            $ultravioletProtectionId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($ultravioletProtectionId);
            $.each(ultravioletProtectionIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($ultravioletProtectionId);
            });

            //抗紫外线-复合
            var $compositeUltravioletProtectionId = $("#compositeUltravioletProtectionId" + idNum);
            $compositeUltravioletProtectionId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeUltravioletProtectionId);
            $.each(ultravioletProtectionIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeUltravioletProtectionId);
            });

            //快干
            var quickDryIdItems = data["jcQuickDryItems"];
            var $quickDryId = $("#quickDryId" + idNum);
            $quickDryId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($quickDryId);
            $.each(quickDryIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($quickDryId);
            });

            //快干-复合
            var $compositeQuickDryId = $("#compositeQuickDryId" + idNum);
            $compositeQuickDryId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeQuickDryId);
            $.each(quickDryIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeQuickDryId);
            });

            //防油
            var oilProofIdItems = data["jcOilProofItems"];
            var $oilProofId = $("#oilProofId" + idNum);
            $oilProofId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($oilProofId);
            $.each(oilProofIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($oilProofId);
            });

            //防油-复合
            var $compositeOilProofId = $("#compositeOilProofId" + idNum);
            $compositeOilProofId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeOilProofId);
            $.each(oilProofIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeOilProofId);
            });

            //防蚊虫
            var antMosquitosIdItems = data["jcAntMosquitosItems"];
            var $antMosquitosId = $("#antMosquitosId" + idNum);
            $antMosquitosId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($antMosquitosId);
            $.each(antMosquitosIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($antMosquitosId);
            });

            //防蚊虫
            var $compositeAntMosquitosId = $("#compositeAntMosquitosId" + idNum);
            $compositeAntMosquitosId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($compositeAntMosquitosId);
            $.each(antMosquitosIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($compositeAntMosquitosId);
            });

            //膜厚度
            var mtIdItems = data["mtItems"];
            var $mtId = $("#mtId" + idNum);
            $mtId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($mtId);
            $.each(mtIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($mtId);
            });

            // 贴膜或涂层工艺列表
            var woblcIdItems = data["wblcItems"];
            var $woblcId = $("#woblcId" + idNum);
            $woblcId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($woblcId);
            $.each(woblcIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($woblcId);
            });

            //物料位置列表
            var positionItems = data["positionItems"];
            var $positionIds = $('#positionIds' + idNum);
            $positionIds.empty();
            $.each(positionItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($positionIds);
            });
            $positionIds.selectpicker({noneSelectedText: '...请选择...'});
            $positionIds.selectpicker('refresh');

            // 用量单位列表
            var unitIdItems = data["unitItems"];
            var $unitId = $("#unitId" + idNum);
            $unitId.empty();
            $("<option></option>").val('').text("...请选择...").appendTo($unitId);
            $.each(unitIdItems, function (i, item) {
                $("<option></option>").val(item["natrualkey"]).text(item["name"]).appendTo($unitId);
            });

            if ($.isFunction(callback)) {
                callback();
            }

        };

    /**
     *
     * @type {{bomId: string, fabricId: string, nameNum: string, fabricsName: string, materialTypeId: string, classicId: string, spId: string, yearCode: string, productTypeId: string, serialNumber: string, pantoneIds: string, positionIds: string, dyeId: string, finishId: string, blcId: string, momcId: string, comocId: string, wvpId: string, mtId: string, woblcId: string, unitId: string, unitAmount: string, showFlag: boolean, saveFlag: boolean, delFlag: boolean, currenId: number}}
     */
    var fabric = {
        bomId: "",
        fabricId: "",
        nameNum: "",
        fabricsName: "",
        materialTypeId: "",
        classicId: "",
        spId: "",
        yearCode: "",
        productTypeId: "",
        serialNumber: "",
        pantoneIds: "",
        positionIds: "",
        dyeId: "",
        finishId: "",
        blcId: "",
        momcId: "",
        comocId: "",
        wvpId: "",
        mtId: "",
        woblcId: "",
        unitId: "",
        unitAmount: "",
        showFlag: false,//页面是否展示
        saveFlag: false,//是否已保存
        delFlag: false,//是否已删除
        currenId: 0 //面料下标
    };


    /**
     * 新增/修改校验字段描述
     * @returns {{name: {validators: {notEmpty: {message: string}}}, customerId: {validators: {notEmpty: {message: string}}}}}
     */
    var fieldsDesc =
    {
        materialTypeId: {
            validators: {
                notEmpty: {
                    message: '材料类别为必填项'
                }
            }
        },
        spId: {
            validators: {
                notEmpty: {
                    message: '供应商为必填项'
                }
            }
        },
        yearCode: {
            validators: {
                notEmpty: {
                    message: '年份为必填项'
                }
            }
        },
        classicId: {
            validators: {
                notEmpty: {
                    message: '材质为必填项'
                }
            }
        },
        pantoneIds: {
            validators: {
                notEmpty: {
                    message: '颜色为必填项'
                }
            }
        },
        productTypeId: {
            validators: {
                notEmpty: {
                    message: '品名为必填项'
                }
            }
        },
        specificationId: {
            validators: {
                notEmpty: {
                    message: '纱支密度为必填项'
                }
            }
        },
        dyeId: {
            validators: {
                notEmpty: {
                    message: '染色方式为必填项'
                }
            }
        },
        finishId: {
            validators: {
                notEmpty: {
                    message: '防泼水为必填项'
                }
            }
        },
        blcId: {
            validators: {
                notEmpty: {
                    message: '复合或涂层为必填项'
                }
            }
        }
    };


    var buildMyTemplateData = function (idNum) {
        var data = {
            "fabric": [
                {
                    "currenId": idNum,
                    "fabricDivId": "fabricDivId" + idNum,
                    "fabricTitleId": "fabricTitleId" + idNum,
                    "serialNumber": "serialNumber" + idNum,
                    "fabricId": "fabricId" + idNum,
                    "fabricNo": "fabricNo" + idNum,
                    "fabricNoName": "自定义编号" + idNum,
                    "fabricTitleName": title_type + idNum,
                    "fabricName": "fabricName" + idNum,
                    "fabricEyeId": "fabricEyeId" + idNum,
                    "fabricTrashId": "fabricTrashId" + idNum,
                    "fabricRepeatId": "fabricRepeatId" + idNum,
                    "fabricCopyId": "fabricCopyId" + idNum,
                    "fabricFormId": "fabricFormId" + idNum,
                    "fabricAllInfoId": "fabricAllInfoId" + idNum,
                    "fabricDetailId": "fabricDetailId" + idNum,
                    "materialTypeId": "materialTypeId" + idNum,
                    "spId": "spId" + idNum,
                    "yearCode": "yearCode" + idNum,
                    "classicId": "classicId" + idNum,
                    "pantoneIds": "pantoneIds" + idNum,
                    "productTypeId": "productTypeId" + idNum,
                    "specificationId": "specificationId" + idNum,
                    "dyeId": "dyeId" + idNum,
                    "finishId": "finishId" + idNum,
                    "blcId": "blcId" + idNum,

                    "compositeDiv": "compositeDiv" + idNum,
                    "tiemoDiv": "tiemoDiv" + idNum,
                    "compositeClassicId": "compositeClassicId" + idNum,
                    "compositePantoneIds": "compositePantoneIds" + idNum,
                    "compositeProductTypeId": "compositeProductTypeId" + idNum,
                    "compositeSpecificationId": "compositeSpecificationId" + idNum,
                    "compositeDyeId": "compositeDyeId" + idNum,
                    "compositeFinishId": "compositeFinishId" + idNum,

                    "compositeWvpId": "compositeWvpId" + idNum,

                    "compositeWaterProofId": "compositeWaterProofId" + idNum,
                    "compositePermeabilityId": "compositePermeabilityId" + idNum,
                    "compositeWaterpressureId": "compositeWaterpressureId" + idNum,
                    "compositeUltravioletProtectionId": "compositeUltravioletProtectionId" + idNum,
                    "compositeQuickDryId": "compositeQuickDryId" + idNum,
                    "compositeOilProofId": "compositeOilProofId" + idNum,
                    "compositeAntMosquitosId": "compositeAntMosquitosId" + idNum,


                    "waterProofId": "waterProofId" + idNum,
                    "permeabilityId": "permeabilityId" + idNum,
                    "waterpressureId": "waterpressureId" + idNum,
                    "ultravioletProtectionId": "ultravioletProtectionId" + idNum,
                    "quickDryId": "quickDryId" + idNum,
                    "oilProofId": "oilProofId" + idNum,
                    "antMosquitosId": "antMosquitosId" + idNum,

                    "momcId": "momcId" + idNum,
                    "comocId": "comocId" + idNum,
                    "wvpId": "wvpId" + idNum,
                    "mtId": "mtId" + idNum,
                    "woblcId": "woblcId" + idNum,
                    "isShow": "isShow" + idNum,
                    "unitId": "unitId" + idNum,
                    "positionIds": "positionIds" + idNum,
                    "positionIdBl": "positionIdBl" + idNum,
                    "unitAmount": "unitAmount" + idNum,
                    "attritionRate": "attritionRate" + idNum,
                    "unitPrice": "unitPrice" + idNum,
                    "colorPrice": "colorPrice" + idNum,
                    "colorAmount": "colorAmount" + idNum,
                    "totalAmount": "totalAmount" + idNum,
                    "totalPrice": "totalPrice" + idNum
                }
            ]
        };
        return data;
    };

    function getFabricItem(idNum) {

        var fabricsInfo = {};//面料基本信息

        fabricsInfo.spId = $("#spId" + idNum).val();
        fabricsInfo.yearCode = $("#yearCode" + idNum).val();
        fabricsInfo.classicId = $("#classicId" + idNum).val();
        fabricsInfo.pantoneIds = $("#pantoneIds" + idNum).val();
        fabricsInfo.productTypeId = $("#productTypeId" + idNum).val();

        //颜色多选
        var pantoneIds = $("#pantoneIds" + idNum).select2('data');
        fabricsInfo.pantoneIds = pantoneIds;
        var compositePantoneIds = $("#compositePantoneIds" + idNum).select2('data');
        fabricsInfo.compositePantoneIds = compositePantoneIds

        //位置多选
        var positionIds = $("#positionIds" + idNum).val();
        var materialPositions = [];
        if (null != positionIds && positionIds.length > 0) {
            for (var idx = 0, len = positionIds.length; idx < len; idx++) {
                var materialPosition = {"positionId": positionIds[idx]};
                materialPositions.push(materialPosition)
            }
        }

        var positionIdBl = $("#positionIdBl" + idNum).val();

        fabricsInfo.positionIds = materialPositions;
        fabricsInfo.positionIdBl = positionIdBl;
        fabricsInfo.materialTypeId = $("#materialTypeId" + idNum).val();
        fabricsInfo.nameNum = idNum;
        fabricsInfo.serialNumber = idNum;
        fabricsInfo.fabricId = $("#fabricId" + idNum).val();
        fabricsInfo.fabricNo = $("#fabricNo" + idNum).val();
        fabricsInfo.isShow = $("#isShow" + idNum).val();
        fabricsInfo.compositeClassicId = $("#compositeClassicId" + idNum).val();
        fabricsInfo.compositeProductTypeId = $("#compositeProductTypeId" + idNum).val();

        fabricsInfo.specificationId = $("#specificationId" + idNum).val();
        fabricsInfo.dyeId = $("#dyeId" + idNum).val();
        fabricsInfo.finishId = $("#finishId" + idNum).val();
        fabricsInfo.compositeSpecificationId = $("#compositeSpecificationId" + idNum).val();
        fabricsInfo.compositeDyeId = $("#compositeDyeId" + idNum).val();
        fabricsInfo.compositeFinishId = $("#compositeFinishId" + idNum).val();
        fabricsInfo.compositeWvpId = $("#compositeWvpId" + idNum).val();
        fabricsInfo.blcId = $("#blcId" + idNum).val();
        fabricsInfo.momcId = $("#momcId" + idNum).val();
        fabricsInfo.comocId = $("#comocId" + idNum).val();
        fabricsInfo.wvpId = $("#wvpId" + idNum).val();
        fabricsInfo.mtId = $("#mtId" + idNum).val();
        fabricsInfo.woblcId = $("#woblcId" + idNum).val();

        fabricsInfo.compositeWaterProofId = $("#compositeWaterProofId" + idNum).val();
        fabricsInfo.compositePermeabilityId = $("#compositePermeabilityId" + idNum).val();
        fabricsInfo.compositeWaterpressureId = $("#compositeWaterpressureId" + idNum).val();
        fabricsInfo.compositeUltravioletProtectionId = $("#compositeUltravioletProtectionId" + idNum).val();
        fabricsInfo.compositeQuickDryId = $("#compositeQuickDryId" + idNum).val();
        fabricsInfo.compositeOilProofId = $("#compositeOilProofId" + idNum).val();
        fabricsInfo.compositeAntMosquitosId = $("#compositeAntMosquitosId" + idNum).val();

        fabricsInfo.attritionRate = $("#attritionRate" + idNum).val();
        fabricsInfo.unitPrice = $("#unitPrice" + idNum).val();
        fabricsInfo.colorPrice = $("#colorPrice" + idNum).val();
        fabricsInfo.colorAmount = $("#colorAmount" + idNum).val();
        fabricsInfo.totalAmount = $("#totalAmount" + idNum).val();
        fabricsInfo.totalPrice = $("#totalPrice" + idNum).val();
        fabricsInfo.unitId = $("#unitId" + idNum).val();
        fabricsInfo.unitAmount = $("#unitAmount" + idNum).val();

        return fabricsInfo;
    }


    /**
     * 获取每个面料的详细信息
     * @param idNum
     */
    function buildFabricItem(idNum) {
        var fabricItem = {};
        var fabricsInfo = {};//面料基本信息
        fabricsInfo.spId = $("#spId" + idNum).val();
        fabricsInfo.yearCode = $("#yearCode" + idNum).val();
        fabricsInfo.classicId = $("#classicId" + idNum).val();
        fabricsInfo.pantoneIds = $("#pantoneIds" + idNum).val();
        fabricsInfo.productTypeId = $("#productTypeId" + idNum).val();

        var pantoneIds = $("#pantoneIds" + idNum).val();
        var materialPantoneIds = [];
        if (null != pantoneIds && pantoneIds.length > 0) {
            //noinspection JSDuplicatedDeclaration
            for (var idx = 0, len = pantoneIds.length; idx < len; idx++) {
                var materialPantoneId = {"pantoneId": pantoneIds[idx]};
                materialPantoneIds.push(materialPantoneId);
            }
        }
        fabricsInfo.pantoneIds = materialPantoneIds;

        var compositePantoneIds = $("#compositePantoneIds" + idNum).val();
        var materialCompositePantoneIds = [];
        if (null != compositePantoneIds && compositePantoneIds.length > 0) {
            //noinspection JSDuplicatedDeclaration
            for (var idx = 0, len = compositePantoneIds.length; idx < len; idx++) {
                var materialPantoneId = {"pantoneId": compositePantoneIds[idx]};
                materialCompositePantoneIds.push(materialPantoneId);
            }
        }
        fabricsInfo.compositePantoneIds = materialCompositePantoneIds;


        var positionIds = $("#positionIds" + idNum).val();
        var materialPositions = [];
        if (null != positionIds && positionIds.length > 0) {
            for (var idx = 0, len = positionIds.length; idx < len; idx++) {
                var materialPosition = {"positionId": positionIds[idx]};
                materialPositions.push(materialPosition)
            }
        }
        var positionIdBl = $("#positionIdBl" + idNum).val();
        fabricsInfo.positionIds = materialPositions;
        fabricsInfo.positionIdBl = positionIdBl;
        fabricsInfo.materialTypeId = $("#materialTypeId" + idNum).val();
        fabricsInfo.nameNum = idNum;
        fabricsInfo.fabricId = $("#fabricId" + idNum).val();
        fabricsInfo.fabricNo = $("#fabricNo" + idNum).val();
        fabricsInfo.serialNumber = idNum;
        fabricsInfo.fabricName = $("#fabricName" + idNum).val();
        fabricsInfo.isShow = $("#isShow" + idNum).val();
        fabricsInfo.compositeClassicId = $("#compositeClassicId" + idNum).val();
        fabricsInfo.compositeProductTypeId = $("#compositeProductTypeId" + idNum).val();


        var fabricsDetailInfo = {};//面料描述信息
        fabricsDetailInfo.specificationId = $("#specificationId" + idNum).val();
        fabricsDetailInfo.dyeId = $("#dyeId" + idNum).val();
        fabricsDetailInfo.finishId = $("#finishId" + idNum).val();
        fabricsDetailInfo.blcId = $("#blcId" + idNum).val();
        fabricsDetailInfo.momcId = $("#momcId" + idNum).val();
        fabricsDetailInfo.comocId = $("#comocId" + idNum).val();
        fabricsDetailInfo.wvpId = $("#wvpId" + idNum).val();
        fabricsDetailInfo.mtId = $("#mtId" + idNum).val();
        fabricsDetailInfo.woblcId = $("#woblcId" + idNum).val();
        fabricsDetailInfo.fabricId = fabricsInfo.fabricId;
        fabricsDetailInfo.compositeSpecificationId = $("#compositeSpecificationId" + idNum).val();
        fabricsDetailInfo.compositeDyeId = $("#compositeDyeId" + idNum).val();
        fabricsDetailInfo.compositeFinishId = $("#compositeFinishId" + idNum).val();
        fabricsDetailInfo.compositeWvpId = $("#compositeWvpId" + idNum).val();
        fabricsDetailInfo.waterProofId = $("#waterProofId" + idNum).val();
        fabricsDetailInfo.permeabilityId = $("#permeabilityId" + idNum).val();
        fabricsDetailInfo.ultravioletProtectionId = $("#ultravioletProtectionId" + idNum).val();
        fabricsDetailInfo.quickDryId = $("#quickDryId" + idNum).val();
        fabricsDetailInfo.oilProofId = $("#oilProofId" + idNum).val();
        fabricsDetailInfo.antMosquitosId = $("#antMosquitosId" + idNum).val();
        fabricsDetailInfo.compositeWaterProofId = $("#compositeWaterProofId" + idNum).val();
        fabricsDetailInfo.compositePermeabilityId = $("#compositePermeabilityId" + idNum).val();
        fabricsDetailInfo.compositeWaterpressureId = $("#compositeWaterpressureId" + idNum).val();
        fabricsDetailInfo.compositeQuickDryId = $("#compositeQuickDryId" + idNum).val();
        fabricsDetailInfo.compositeOilProofId = $("#compositeOilProofId" + idNum).val();
        fabricsDetailInfo.compositeAntMosquitosId = $("#compositeAntMosquitosId" + idNum).val();

        var materialSpInfo = {};//面料用量信息
        materialSpInfo.attritionRate = $("#attritionRate" + idNum).val();
        materialSpInfo.unitPrice = $("#unitPrice" + idNum).val();
        materialSpInfo.totalAmount = $("#totalAmount" + idNum).val();
        materialSpInfo.totalPrice = $("#totalPrice" + idNum).val();
        materialSpInfo.colorPrice = $("#colorPrice" + idNum).val();
        materialSpInfo.colorAmount = $("#colorAmount" + idNum).val();
        materialSpInfo.fabricId = fabricsInfo.fabricId;

        var materialUnitDosage = {};//面料单位用量
        materialUnitDosage.unitId = $("#unitId" + idNum).val();
        materialUnitDosage.unitAmount = $("#unitAmount" + idNum).val();
        materialUnitDosage.fabricId = fabricsInfo.fabricId;
        fabricItem.fabricsInfo = fabricsInfo;
        fabricItem.fabricsDetailInfo = fabricsDetailInfo;
        fabricItem.materialSpInfo = materialSpInfo;
        fabricItem.materialUnitDosage = materialUnitDosage;
        return fabricItem;
    }

    /**
     * 监控下拉列表变化
     */
    function monitorSelectChange() {

        var _name = $(this).attr('name');
        var _thisVal = $(this).val();
        var _thisId = $(this).attr('id');
        //选择复合时，显示响应的
        if (_name == 'blcId') {
            var idNum = _thisId.substring(5);
            showOrHideCompositeDiv(_thisVal, idNum, function () {

            });
        }
        //选择材料类别
        else if (_name == 'materialTypeId') {
            var idNum = _thisId.substring(14);
            reloadSpSelect(_thisVal, idNum, function () {

            });
        } else if (_name == 'isShow') {
            var idNum = _thisId.substring(6);
            if (is_show_fabric == _thisVal) {
                chgFabricId(idNum);
            }
        }

    }

    function chgFabricId(idNum) {
        var _thisFabricId = $("#fabricId" + idNum).val();
        $("#fabricId").val(_thisFabricId);
    }


    /**
     * 面板内容初始化
     */
    $(function () {

        //显示复合面料信息
        $("#fabricsItemInfo").on("change", "select", monitorSelectChange);

        //$("#bomDescDetail").hide();

        //第一步，页面加载时，加载所有数据/分步加载数据

        //页面加载时，面料全部隐藏
        $("div[id^=fabricAllInfoId]").hide();

        //点击添加面料
        $("#imgAddFabric").click(function () {
            addFabric();
            //赋初始化值：保存标志，显示标志
            var size = $("div[id^=fabricAllInfoId]").length;
            bom.fabricItems[size - 1] = fabric;
        });
    });

    var bom = {
        projectId: "",//项目id
        bomId: "",//BOMId
        fabricItems: []//所有面料
    };
    //window.saveFabric = saveFabric;
    window.refreshFabricSelect = refreshFabricSelect;
    window.trashFabricSelect = trashFabricSelect;
    window.showOrHideFabric = showOrHideFabric;
    window.copyFabric = copyFabric;

}(jQuery));