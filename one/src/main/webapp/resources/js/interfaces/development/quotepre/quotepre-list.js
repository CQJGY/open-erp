/**
 * Created by zhangjh on 2016/4/14.
 */
(function () {
    "use strict";
    var path = $.basepath();
    var searchURL = path + "/development/quotepre/search/";
    /**
     * 列表展示内容
     * @returns {*[]}
     */
    var columnsName = [
        {"data": null},
        {"data": "projectName"},
        {"data": "bomName"},
        {"data": "spName"},
        {"data": "factoryOffer"},
        {"data": "euroPrice"},
        {"data": "remark"},
        {"data": "updateTime"},
        {"data": null}
    ];

    var mHtml = '';
    var table;
    $(function () {

        var tpl = $("#tpl").html();
        //预编译模板
        var template = Handlebars.compile(tpl);
        var indexOpreation = columnsName.length - 1;
        table = $('#example').DataTable({
            ajax: {
                url: searchURL
            },
            createdRow: function ( row, data, index ) {
                /* 设置表格中的内容居中 */
                $('td', row).attr("class","text-center");
            },
            serverSide: true,
            columns: columnsName,
            order: [[1, "desc"]], /*默认第一列倒序*/
            fnDrawCallback: reloadDetailSelectData,
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, row, meta) {
                        var html = "<input type='checkbox' name='checkList' value='" + data.bomId + "'>";
                        return html;
                    }
                },
                {
                    targets: indexOpreation,
                    render: function (data, type, row, meta) {
                        var context =
                        {
                            func: [
                                {"name": "更新", "fn": "$.editQuotePre(\'" + data.bomId + "\')", "type": "primary"}
                            ]
                        };
                        var html = template(context);
                        return html;
                    }
                }

            ],
            "language": {
                "lengthMenu": "_MENU_",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 共 _PAGES_ 页 )",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                }
            },
            "dom": "<'row'<'col-xs-1'l><'#mytool.col-xs-9'><'col-xs-2'f>r>" +
            "t" +
            "<'row'<'col-xs-6'i><'col-xs-6'p>>",
            initComplete: function () {
                $("#mytool").append(mHtml);
            }

        });


    });


    var editQuotePre = function (_bomId) {
        window.location.href = path + "/development/quotepre/add/" + _bomId;
    }

    //第一次初始化下拉列表 & 添加下拉列表监听事件
    var reloadDetailSelectData = function () {
        // $.sendRestFulAjax(project_selectURL, null, 'GET', 'json', initSelect);
    }
    $.editQuotePre = editQuotePre;
}());