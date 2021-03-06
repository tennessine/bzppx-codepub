/**
 * 模块
 * Copyright (c) 2017 phachon@163.com
 */
var Module = {

	defaults : function(defaults) {
		var arr = defaults.split(",");
		console.log(arr);
		$('[data-type="node"][name="node_id"]').each(function() {
			console.log(this.value);
			var checked = $.inArray(this.value, arr) > -1 ? true : false;
			this.checked = checked;
		});
	},

	node : function(element) {
		var moduleId = $("input[name='module_id']").val();
		var id = $(element).val();
		var checked = $(element).is(':checked');
		var type = $(element).attr("data-type");
		var nodeIds = [];

		if(type == 'group') {
			$('[name="node_id"][data-parent='+id+']').each(function() {
				this.checked = checked;
				nodeIds.push($(this).val());
			});
		}
		if(type == 'node') {
			nodeIds.push(id);
			var parentId = $(element).attr("data-parent");
			var flag = true;
			$('[data-type="node"][data-parent='+parentId+']').each(function() {
				if (this.checked != checked) {
					flag = false;
				}
			});
			if (flag) {
				$('[data-type="group"][value='+parentId+']').each(function() {
					this.checked = checked
				});
			}
		}

		var isChecked = 1;
		if(checked == false) {
			isChecked = 0;
		}
		console.log(nodeIds);
		Module.save(nodeIds.join(","), moduleId, isChecked);
	},
	
	save: function (nodeIds, moduleId, isChecked) {
		$.ajax({
			type : 'post',
			url : '/module/nodeSave',
			data : {'node_ids':nodeIds, 'module_id': moduleId, 'is_check': isChecked},
			dataType: "json",
			success : function(response) {
				if(response.code == 0) {
					Form.failedBox(response.message);
					console.log("失败: "+response.message)
				}
			},
			error : function(response) {
				Form.failedBox("添加节点失败");
				console.log("失败");
			}
		});
	}
};