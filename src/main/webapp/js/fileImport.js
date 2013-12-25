var FileFormatSelectionDialog = (function() {
    var instance = null;

    function PrivateConstructor() {
    	var dialog = $("#fileFormatSelectionDialog");
    	
    	function init() {
    		//Initialize what happens when we show the dialog
			dialog.on('show.bs.modal', function (e) {
				$("span#fileFormatError").hide();
                $("input:radio[name=FileFormatSelection]").attr("checked", false);
                
                var fileName = $("#fileFormatSelectionDialog").data("fileName");
                console.log("show.bs.modal::Select filename:" + fileName);
                if(fileName.match(".csv$") || fileName.match(".tsv$") || fileName.match(".txt$") || fileName.match(".log$")) {
                    $(":radio[name=FileFormatSelection][value=CSVFile]").prop("checked", true);
                } else if(fileName.match(".xml$")) {
                    $(":radio[name=FileFormatSelection][value=XMLFile]").prop("checked", true);
                } else if(fileName.match(".xls$") || fileName.match(".xlsx$")) {
                    $(":radio[name=FileFormatSelection][value=ExcelFile]").prop("checked", true);
                } else if(fileName.match(".owl$") || fileName.match(".rdf$")) {
                    $(":radio[name=FileFormatSelection][value=Ontology]").prop("checked", true);
                } else if(fileName.match(".json$")) {
                    $(":radio[name=FileFormatSelection][value=JSONFile]").prop("checked", true);
                }
                
				var worksheets = $('.Worksheet');
                if (worksheets.size() > 0){
                    disableRevision(false);
  
                    worksheets.each(function(){
                        var item = $('<option />');
                        item.val($(this).attr('id'));
                        item.text($(this).find('.tableTitleTextDiv').text());

                        $('#revisedWorksheetSelector').append(item);
                    });
                } else {
                    disableRevision(true);
                }
			});
			
			//Initialize handler for Save button
			//var me = this;
			$('#btnSave', dialog).on('click', function (e) {
				e.preventDefault();
				saveDialog(e);
                dialog.modal('hide');
			});
    	}
    	
		
		function disableRevision (disabled){
            $('#revisedWorksheetSelector').prop('disabled', disabled);
            $("input:checkbox[name='RevisionCheck']").prop('disabled', disabled);
        };
        
        function saveDialog(e) {
        	console.log("Save clicked");
			var data = dialog.data("formData");
			var selectedFormat = $("input:radio[name='FileFormatSelection']:checked").val();
			console.log("Selected format:" + selectedFormat);
            if(selectedFormat == null || selectedFormat == "") {
                $("span#fileFormatError").show();
                return false;
            }

            var urlString = "RequestController?workspaceId=" + $.workspaceGlobalInformation.id;
            
            //MVS: add the id of the revised worksheet in the request
            if ($("input:checkbox[name='RevisionCheck']").prop('checked')) {
                urlString += "&revisedWorksheet=" + $('#revisedWorksheetSelector').val();
            }

            urlString += "&command=";

            $("#fileupload").fileupload({
            	url : urlString + "Import" + selectedFormat + "Command",
            	done : function(e, data) {
            		FileOptionsDialog.getInstance().show(data.result, selectedFormat);
            	}
            });
            // Change the command according to the selected format
            /* if(selectedFormat == "CSV") {
                $('#fileupload').fileupload({
                    url : urlString + "ImportCSVFileCommand",
                    done : function(e, data) {
                        resetCSVDialogOptions();
                        showCSVImportOptions(data.result);
                    }
                });
            } else if(selectedFormat == "JSONFile" || selectedFormat == "XMLFile" || selectedFormat== "ExcelFile" || selectedFormat == "Ontology") {
            	$('#fileupload').fileupload({
                	url : urlString + "Import" + selectedFormat + "Command",
                    done : function(e, data) {
                        resetFileDialogOptions();
                        showFileImportOptions(data.result, selectedFormat);
                    }
            	});
            }  */

            data.submit();
        };
        
        function show(data) {
        	var fileName = data.files[0].name;
            dialog.data("fileName", fileName);
            dialog.data("formData", data);
            dialog.modal('show');
        };
        
        
        return {	//Return back the public methods
        	show : show,
        	init : init
        };
    };

    function getInstance() {
    	if( ! instance ) {
    		instance = new PrivateConstructor();
    		instance.init();
    	}
    	return instance;
    }
   
    return {
    	getInstance : getInstance
    };
    	
    
})();


var FileOptionsDialog = (function() {
    var instance = null;

    function PrivateConstructor() {
    	var dialog = $("#fileOptionsDialog");
    	
    	function init() {
	    	//Initialize what happens when we show the dialog
			dialog.on('show.bs.modal', function (e) {
				
			});
			
			//Initialize handler for Save button
			$('#btnSave', dialog).on('click', function (e) {
				e.preventDefault();
				saveDialog(e);
                dialog.modal('hide');
			});
			
			
			$('.ImportOption').change(function() {
                reloadOptions(false);
            });
    	}
    	
    	function saveDialog(e) {
    		console.log("Save clicked");
			reloadOptions(true);
    	}
    	
    	function reset() {
			 $("#delimiterSelector :nth-child(1)", dialog).attr('selected', 'selected');
			  $("#headerStartIndex", dialog).val("1");
			  $("#startRowIndex", dialog).val("2");
			  $("#textQualifier", dialog).val("\"");
			  $("#encoding", dialog).val("\"");
			  $("#maxNumLines", dialog).val("1000");
		};
		
		function showOptions(responseJSON) {
			console.log("ShowOptions: " + responseJSON);
			dialog.data("formData", responseJSON);
			
			var headers = null;
			var previewTable = $("#previewTable", dialog);
			$("thead", previewTable).remove();
			$("tr", previewTable).remove();
			  
			if (responseJSON) {
			    headers = responseJSON["elements"][0]["headers"];
				var encoding = responseJSON["elements"][0]["encoding"];
				$("#encoding", dialog).val(encoding);
				var maxNumLines = responseJSON["elements"][0]["maxNumLines"];
				$("#maxNumLines", dialog).val(maxNumLines);
				if(maxNumLines == -1)
					$("#colMaxNumLines").hide();
				else
					$("#colMaxNumLines").show();
				
				var rows = responseJSON["elements"][0]["rows"];
				generatePreview(headers, rows);
				
				dialog.data("commandId", responseJSON["elements"][0]["commandId"]);
			}
		}
		
		function generatePreview(headers, rows) {
			var previewTable = $("#previewTable", dialog);
			previewTable.append($("<thead>").append("<tr>").append($("<th colspan='4'>").text("File Row Number")));
			if(headers != null)  {
			    var trTag = $("<tr>");
			    $.each(headers, function(index, val) {
			     
			        trTag.append($("<th>").text(val));
			      
			    });
			    previewTable.append(trTag);
			  } else {
			    // Put empty column names
			    var trTag = $("<tr>");
			    $.each(rows[0], function(index, val) {
			      if(index == 0){
			        trTag.append($("<th>").text("-"));
			      } else {
			        trTag.append($("<th>").text("Column_" + index));
			      }
						
			    });
			    previewTable.append(trTag);
			  }
			
			
			  $.each(rows, function(index, row) {
			    var trTag = $("<tr>");
			    $.each(row, function(index2, val) {
			      var displayVal = val;
			      if(displayVal.length > 20) {
			        displayVal = displayVal.substring(0,20) + "...";
			      }
			      if(index2 == 0) {
			        trTag.append($("<td>").addClass("rowIndexCell").text(displayVal));
			      } else {
			        trTag.append($("<td>").text(displayVal));
			      }
			    });
			    previewTable.append(trTag);
			  });
			  
			  
		}
		
		function reloadOptions(execute) {
			var format = dialog.data("format");
			var options = new Object();
			options["command"] = "Import" + format + "Command";
			options["commandId"] = dialog.data("commandId");
			options["delimiter"] = $("#delimiterSelector").val();
			options["CSVHeaderLineIndex"] = $("#headerStartIndex").val();
			options["startRowIndex"] = $("#startRowIndex").val();
			options["textQualifier"] = $("#textQualifier").val();
			options["encoding"] = $("#encoding").val();
			options["maxNumLines"] = $("#maxNumLines").val();
			options["workspaceId"] = $.workspaceGlobalInformation.id;
			options["interactionType"] = "generatePreview";
			
			if(execute) {
				options["execute"] = true;
				options["interactionType"] = "importTable";
			}
			
			$.ajax({
				    url: "RequestController", 
				    type: "POST",
				    data : options,
				    dataType : "json",
				    complete : function (xhr, textStatus) {
				    			if(!execute) {
							    	var json = $.parseJSON(xhr.responseText);
							    	console.log("Got json:" + json);
							    	showOptions(json);
				    			} else {
				    				dialog.modal('hide');
				    				var json = $.parseJSON(xhr.responseText);
				    		        parse(json);
				    		        hideWaitingSignOnScreen();
				    		        showDialogToLoadModel();
				    			}
				    		}
				  });	
				
		}
		
		
		function show(data, format) {
        	reset();
        	var fileName = data["elements"][0]["fileName"];
        	$("#filename", dialog).html(fileName);
        	dialog.data("format", format);
        	showOptions(data);
            
            dialog.modal('show');
		}
		
		return {
			show : show,
			init : init
		};
    };
  
    function getInstance() {
    	if( ! instance ) {
    		instance = new PrivateConstructor();
    		instance.init();
    	}
    	return instance;
    }
   
    return {
    	getInstance : getInstance
    };
})();