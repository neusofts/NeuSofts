<?php
	header('Content-type: text/html; charset=gbk');
	
	class Suggestion {
		public $content;
		
		public function __construct() {
			$this -> getContent();
			$this -> replace();
		}
		
		private function getContent() {
			$this -> content = file_get_contents('http://suggestion.baidu.com/su?wd='. $_POST['str'] .'&json=1&p=3');
		}
		
		protected function replace() {
			$this -> content = str_replace('window.baidu.sug(', '', $this -> content);
			$this -> content = str_replace(');', '', $this -> content);
			
			$this -> content = str_replace('"tzx":', '"links":', $this -> content);
			$this -> content = str_replace('"info":', '"link":', $this -> content);
			$this -> content = str_replace('"site":', '"title":', $this -> content);
			$this -> content = str_replace('"showurl":', '"host":', $this -> content);
			$this -> content = str_replace('"siteurl":', '"href":', $this -> content);
			$this -> content = str_replace('"iconurl":', '"ico":', $this -> content);
			$this -> content = str_replace('"hit_q":', '"match":', $this -> content);
			
			$this -> content = str_replace('"q":', '"query":', $this -> content);
			$this -> content = str_replace('"s":', '"suggests":', $this -> content);
			$this -> content = str_replace('"bs":', '"other":', $this -> content);
			$this -> content = str_replace('"p":false,', '"neusoftsEngineStatus":"successful",', $this -> content);
		}
		
		private function __destruct() {
			unset($this -> content);
		}
	}
	
	$S = new Suggestion;
	
	echo $S -> content;
?>