jQuery(document).ready( function () {

	 jQuery('#ACT_wait').hide();
	jQuery('#ACT_feedback').hide();
	jQuery('#ACT_form').submit(ajaxSubmit);

function ajaxSubmit(){
	if (!validate_ACT()) {
		return;
	}
   jQuery("#ACT_wait").show();
	var ACT_shortcode_form = jQuery(this).serialize();
	jQuery.ajax({
		type:"POST",
		url: ajaxurl,
		data: ACT_shortcode_form,
		success:function(message){
			jQuery('#ACT_feedback').show();
			 jQuery('#ACT_wait').hide();
			 jQuery("#ACT_feedback").html(message);
			alert(ACT_obj.alert_end);
		}
	});
	
	return false;
}
	
	jQuery('#single').change(function() {
		if(jQuery(this).is(":checked")) {
			jQuery('#show_aut').prop('checked', false);
			jQuery('#show_aut').prop('disabled',true);
			jQuery('#include_admin').prop('checked',true);
			jQuery('#include_admin').prop('disabled',true);
			jQuery('#limit_aut').prop('disabled',true);
		}
		else {
			jQuery('#show_aut').prop('disabled',false);
			jQuery('#include_admin').prop('disabled',false);
			jQuery('#limit_aut').prop('disabled',false);
		}
	});
	
	function validate_ACT() {
		if ((jQuery('#show_cat').prop("checked")==false) &&
			(jQuery('#show_aut').prop("checked")==false) &&
			(jQuery('#show_tit').prop("checked")==false)) {
				alert (ACT_obj.alert_showlist);
				return false;
			}
		return true;
	}
});