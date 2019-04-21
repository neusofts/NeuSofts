<?php
/*****************************************************************
*
* 
* a hierarchical list of all posts by nested categories, post title and authors
* © Fabio Marzocca - 2015-2017
*
* Backend funtions
******************************************************************/


function ACT_shortcode_helper()
{
?>
<div class="wrap">
    <div id="ACT_main_body" >
    
    
    <div id="form_container">
    
                <div id="ACT_topbar">&nbsp;</div>

        <form id="ACT_form" class="appnitro"  method="post" action="">
                    <div class="form_description">
            <div class="ACT_h2">List All Posts by Author, nested Categories and Titles</div>
            <p><?php echo _e('Automatic shortcode generator', 'list-all-posts-by-authors-nested-categories-and-titles');?></p>
        </div>  
        <div id="first_col" style="width: 59%; float:left; display:inline;">
                            
            <ul >
            
            <li id="li_2" >
        <label class="description" ><?php echo __('Select what list(s) to show:', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
        <span>
            <input id="show_cat" name="show_cat" class="element checkbox" type="checkbox" value="1" checked/>
<label class="choice" for="show_cat"><?php echo __('Categories', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
<input id="show_aut" name="show_aut" class="element checkbox" type="checkbox" value="1" />
<label class="choice" id="aut_label" for="show_aut"><?php echo __('Authors', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
<input id="show_tit" name="show_tit" class="element checkbox" type="checkbox" value="1" />
<label class="choice" for="show_tit"><?php echo __('Titles', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>

        </span><p class="guidelines" id="guide_2"><small><?php echo __('Selecting more than one choice will include a selector dropdown box in your page.', 'list-all-posts-by-authors-nested-categories-and-titles');?></small></p> 
        </li>       <li id="li_4" >
        <label class="description"><?php echo __('Is this a single user site?', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>
        <span>
            <input id="single" name="single" class="element checkbox" type="checkbox" value="1" />
<label class="choice" for="single"><?php echo __('Yes', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>

        </span><p class="guidelines" id="guide_4"><small><?php echo __('This option is for websites with a single author. It removes grouping by Authors and any author name in the list.', 'list-all-posts-by-authors-nested-categories-and-titles');?> </small></p> 
        </li>       <li id="li_5" >
        <label class="description" ><?php echo __('Include admin\'s posts?', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>
        <span>
            <input id="include_admin" name="include_admin" class="element checkbox" type="checkbox" value="1" />
<label class="choice" for="include_admin"><?php echo __('Yes', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>

        </span> 
        </li>       <li class="section_break">

            <label class="description"><?php echo __('Limit number of posts to max:', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
            <p><?php echo __('Limit the number of posts in the lists, including only<br /> a certain number of the most recent posts.<br />This is achieved separately for the 3 lists.', 'list-all-posts-by-authors-nested-categories-and-titles');?></p>
        </li>       <li id="li_3" >
        <label class="description" ><?php echo __('Categories (0 means no limit)', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>
        <div>
            <input id="limit_cat" name="limit_cat" class="element text small" type="number" maxlength="4" value="0"/> 
        </div><p class="guidelines" id="guide_3"><small><?php echo __('Limit the Categories list to only the "x" most recent for every category.', 'list-all-posts-by-authors-nested-categories-and-titles');?></small></p> 
        </li>       <li id="li_7" >
        <label class="description" ><?php echo __('Authors (0 means no limit)', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>
        <div>
            <input id="limit_aut" name="limit_aut" class="element text small" type="number" maxlength="4" value="0"/> 
        </div><p class="guidelines" id="guide_7"><small><?php echo __('Limit the Authors list to only the "x" most recent for every author.', 'list-all-posts-by-authors-nested-categories-and-titles');?></small></p> 
        </li>       <li id="li_8" >
        <label class="description" ><?php echo __('Titles (0 means no limit)', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>
        <div>
            <input id="limit_tit" name="limit_tit" class="element text small" type="number" maxlength="4" value="0"/> 
        </div><p class="guidelines" id="guide_8"><small><?php echo __('Limit the Titles list to only the "x" most recent ones.', 'list-all-posts-by-authors-nested-categories-and-titles');?></small></p> 
                </li><br />     
        <li id="li_9" >
            <label class="description" ><?php echo __('Show posts in reverse date order <br />(not applicable to List by Title)', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>  
            <span>
            <input id="reverse_date" name="reverse_date" class="element checkbox" type="checkbox" value="1" /> 
        <label class="choice" for="reverse_date"><?php echo __('Yes', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
            </span><p class="guidelines" id="guide_9"><small><?php echo __('Default is from newest to oldest post', 'list-all-posts-by-authors-nested-categories-and-titles');?> </small></p> 
            </li>        
				
        <li id="li_9b" >
            <label class="description" ><?php echo __('Show posts date', 'list-all-posts-by-authors-nested-categories-and-titles');?> </label>  
            <span>
            <input id="postdate" name="postdate" class="element checkbox" type="checkbox" value="1" /> 
        <label class="choice" for="postdate"><?php echo __('Yes', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
            </span><p class="guidelines" id="guide_9b"><small><?php echo __('Default is NO', 'list-all-posts-by-authors-nested-categories-and-titles');?> </small></p> 
            </li>   				
				
        </div>
        
        <div id="second_col" style="float:left; width:40%; display:inline">
        <li id="li_10" style="width:99%" >
        <label class="description" ><?php echo __('Categories to be EXCLUDED <br />(posts in selected Categories won\'t be listed)', 'list-all-posts-by-authors-nested-categories-and-titles');?></label>
        <span>
        <br />
            <?php ACT_list_categories(); ?>

            </span><p class="guidelines" id="guide_10"><small><?php echo __('Exclude posts from selected Categories', 'list-all-posts-by-authors-nested-categories-and-titles');?> </small></p> 
        </li>
        </div>
            
                    <li class="buttons" style="clear:both">
                <input type="hidden" name="action" value="ACT_processform" />
                
                <input id="saveForm" class="button_text" type="submit" name="submit" value="<?php echo __('Generate Shortcode', 'list-all-posts-by-authors-nested-categories-and-titles');?>" />
        </li>
            </ul>
        </form> 
        <div id="ACT_feedback"></div>
    </div>
    </div>
    <div id="ACT_wait"></div>
    </div> <!-- wrap -->
<?php
}


function ACT_list_categories()
{

    $args = array(
    'hide_empty' => '0',
    'child_of' =>  '0'
    );
    $i=0;
    $categories = get_categories($args);
    foreach ($categories as $category) {
        if (!$category->parent) {
            $i++;
            echo ('<input id=cat[] name=cat[] class="element checkbox" type = "checkbox" value="'.$category->slug.'" />');
            echo ('<label class="choice" for=cat[]>'.$category->name.'</label>');
            $i = ACT_get_child_cats( $category->term_id, $i, " ");
        }
    }
    echo ('<input type="hidden" name="total_cats" value="'.$i.'" />');
}

function ACT_get_child_cats($cat, $k, $level)
{
    $next = get_categories('hide_empty=0&parent=' . $cat);
    if ($next) :
        $level .= "&#8212;";
        foreach ($next as $category) :
            $k++;
            echo ('<input id=cat[] name=cat[] class="element checkbox" type = "checkbox" value="'.$category->slug.'" />');
            echo ('<label class="choice" for=cat[]> '.$level.' '.$category->name.'</label>');

            $k = ACT_get_child_cats( $category->term_id, $k, $level);
        endforeach;
    endif;
    return $k;
}

function ACT_processform()
{
    
    $sc = "[ACT-list";
    
    /* Show List */
    $showlist= array();
    if ($_POST['show_cat']) {
        $showlist[0] ="Category";
    }
    if ($_POST['show_aut']) {
        $showlist[1] ="Author";
    }
    
    if ($_POST['show_tit']) {
        $showlist[2] ="Title";
    }

    $showlist_string = implode(",", $showlist);
    $sc = $sc." show='".$showlist_string."'";


    /** singleuser **/
    if ($_POST['single']) {
        $sc = $sc." singleuser=1";
    }
    
        /** is admin included? **/
    if ($_POST['include_admin']) {
        $sc = $sc." admin=1";
    }
    
        /** Limit output **/
    if ($_POST['limit_cat']) {
        if ($_POST['limit_cat']>0) {
            $sc = $sc." postspercategory=".$_POST['limit_cat'];
        }
    }
    
    if ($_POST['limit_aut']) {
        if ($_POST['limit_aut']>0) {
            $sc = $sc." postsperauthor=".$_POST['limit_aut'];
        }
    }
    
    if ($_POST['limit_tit']) {
        if ($_POST['limit_tit']>0) {
            $sc = $sc." totalpoststitle=".$_POST['limit_tit'];
        }
    }
    
    /** Post order  **/
    if ($_POST['reverse_date']) {
        $sc = $sc." reverse-date=1";
    }

	if($_POST['postdate']){
		$sc = $sc." postdate=1";
	}
	
    /** Excluded Categories **/
    $cat_array = array();
    $cat=$_POST['cat'];
    if ($cat) {
        while (list ($key,$val) = @each ($cat)) {
            array_push($cat_array, $val);
        }
        $cat_string = implode(",", $cat_array);
        $sc = $sc." exclude='".$cat_string."'";
    }
    
    $sc = $sc."]";
    echo __('This is your shortcode:', 'list-all-posts-by-authors-nested-categories-and-titles');
    echo ("<br /><br />");
    echo "<code style='background-color:#eee'>".$sc."</code><br /><br />";
    echo __('Copy & Paste it into your page', 'list-all-posts-by-authors-nested-categories-and-titles');
    echo ("<br />");
    

    die();
}

?>