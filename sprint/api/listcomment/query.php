<?php

	/**
	 * 文章评论列表
	 */

	require_once('../../library/db.class.php');

	// 请求参数过滤
	$paramFormat =
		isset( $_GET['artid'] )
			&& is_numeric( $_GET['artid'] )
		&& isset( $_GET['page'] )
			&& is_numeric( $_GET['page'] )
		&& isset( $_GET['limit'] )
			&& is_numeric( $_GET['limit'] )
		&& isset( $_GET['date'] )
			&& is_numeric( $_GET['date'] );

	if ( $paramFormat )
	{
		// 文章ID
		$artid =  $_GET['artid'];
		// 请求第几页
		$page = $_GET['page'];
		// 每页行数
		$limit = $_GET['limit'];
		// 摘要长度
		$date = $_GET['date'];

		$Sql = new SQL();

		$Sql->open();

		$result = $Sql->getCommentList( $artid, $page, $limit, $date );

		echo( $result );

		$Sql->close();
	}
	else
	{
		$retError = array
		(
			'success' => false,
			'result'  => null,
			'message' => 'One of your request parameters is error!'
		);
		echo json_encode( $retError );
	}
?>