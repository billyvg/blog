﻿<?php

header("Content-type: text/html; charset=utf-8");
require_once('config.php');
date_default_timezone_set( TIMEZONE );

class SQL
{
	public $host;
	public $user;
	public $pswd;
	public $db;
	public $conn;

    /**
     * 打开数据库连接
     */
    public function open( $host = DB_HOST, $user = DB_USER, $pswd = DB_PASSWORD, $db = DB_NAME )
    {
        $this->host = $host;
        $this->user = $user;
        $this->pswd = $pswd;
        $this->db = $db;
        $this->conn = mysql_connect( $this->host, $this->user, $this->pswd );
        mysql_select_db( $this->db );
        mysql_query( "SET NAMES ".DB_CHARSET );
    }

    /**
     * 关闭数据连接
     */
    public function close()
    {
        mysql_close( $this->conn );
    }

    /**
     * query 基本查询,返回没有格式化字段的结果
     * param  [String] $sql [SQL语句]
     */
    public function query( $sql )
    {
        $result = mysql_query( $sql, $this->conn );
        if( $result )
        {
            // 选项数组集合
            $itemArray = array();
            while( $assoc = mysql_fetch_assoc( $result ) )
            {
                array_push( $itemArray, $assoc );
            }
            // 结果行数
            $total = mysql_num_rows( $result );
            mysql_free_result( $result );
            $resultObject = array
            (
                'items' => $itemArray,
                'total' => $total
            );
            // 最终返回的结果
            $retArray = array
            (
                'success' => true,
                'result'  => $resultObject
            );
        }
        else
        {
            $retArray = array
            (
                'success' => false,
                'result'  => null
            );
        }
        return json_encode( $retArray );
    }

    /**
     * getArchiveList 获取某个栏目的文章列表
     * param  [Number] $catid   [栏目ID]
     * param  [Number] $limit   [每页显示文章数目]
     * param  [Number] $order   [排序方式]
     * param  [Number] $brief   [摘要的长度(字数)]
     */
    public function getArchiveList( $catid, $limit, $order, $brief )
    {
        if( $order === 'date' ) {
            $orderBy = 'post_date';
        }
        // 查询字段
        $fields = "ID, post_title, post_date, post_modified, post_content";
        // 查询条件
        $where = "post_status='publish' AND post_type='post'";
        // 限制条件
        $filter = "ORDER BY $orderBy DESC LIMIT $limit";
        $sql = "SELECT $fields FROM wp_posts WHERE $where $filter";
        // 执行查询操作
        $result = mysql_query( $sql, $this->conn );
        // 查询是否成功
        if( $result )
        {
            // 选项数组集合
            $itemArray = array();
            while( $assoc = mysql_fetch_assoc( $result ) )
            {
                // 摘要截取, 先检测再截取(确保字数)
                $text = fixtags( $assoc['post_content'] );
                $abstract = mb_substr( strip_tags( $text ), 0, $brief, 'utf8');

                // 摘要截取, 先截取再检测(确保性能)
                // $text = mb_substr( $assoc['post_content'], 0, $brief, 'utf8' );
                // $abstract = strip_tags( fixtags( $text ) );

                $itemFormat = array
                (
                    'id'           => $assoc['ID'],
                    'title'        => $assoc['post_title'],
                    'publishDate'  => $assoc['post_date'],
                    'modifiedDate' => $assoc['post_modified'],
                    'content'      => $abstract
                );
                array_push( $itemArray, $itemFormat );
            }
            // 结果行数
            $total = mysql_num_rows( $result );
            mysql_free_result( $result );
            $resultObject = array
            (
                'items' => $itemArray,
                'total' => $total
            );
            // 最终返回的结果
            $retArray = array
            (
                'success' => true,
                'result'  => $resultObject
            );
        }
        else
        {
            $retArray = array
            (
                'success' => false,
                'result'  => null
            );
        }
        return json_encode( $retArray );
    }

    /**
     * getArticle 获取一篇文章的信息
     * param  [Number] $artid   [文章ID]
     */
    public function getArticle( $artid )
    {
        // 查询字段
        $fields = "post_title, post_date, post_modified, post_content";
        // 查询条件
        $filter = "LIMIT 1";
        $sql = "SELECT $fields FROM wp_posts WHERE ID = $artid $filter";
        // 执行查询操作
        $result = mysql_query( $sql, $this->conn );
        // 查询是否成功
        if( $result )
        {
            $assoc = mysql_fetch_assoc( $result );
            mysql_free_result( $result );
            $itemFormat = array
            (
                'title'        => $assoc['post_title'],
                'publishDate'  => $assoc['post_date'],
                'modifiedDate' => $assoc['post_modified'],
                'content'      => $assoc['post_content']
            );
            // 最终返回的结果
            $retArray = array
            (
                'success' => true,
                'result'  => $itemFormat
            );
        }
        else
        {
            $retArray = array
            (
                'success' => false,
                'result'  => null
            );
        }
        return json_encode( $retArray );
    }

    /**
     * getTitleList 获取一列文章标题(用于aside)
     * param  [Number] $type     [请求文章类型,可为catid,new,comments]
     * param  [Number] $amount   [请求结果条数]
     */
    public function getTitleList( $type, $amount )
    {
        // 查询字段
        $fields = "ID, post_title, post_date";
        // 查询条件
        $where = "post_status='publish' AND post_type='post'";
        // 限制条件
        $filter = "ORDER BY post_date DESC LIMIT $amount";
        $sql = "SELECT $fields FROM wp_posts WHERE $where $filter";
        // 执行查询操作
        $result = mysql_query( $sql, $this->conn );
        // 查询是否成功
        if( $result )
        {
            // 选项数组集合
            $itemArray = array();
            while( $assoc = mysql_fetch_assoc( $result ) )
            {
                $itemFormat = array
                (
                    'id'           => $assoc['ID'],
                    'title'        => $assoc['post_title'],
                    'publishDate'  => $assoc['post_date']
                );
                array_push( $itemArray, $itemFormat );
            }
            // 结果行数
            $total = mysql_num_rows( $result );
            mysql_free_result( $result );
            $resultObject = array
            (
                'items' => $itemArray,
                'total' => $total
            );
            // 最终返回的结果
            $retArray = array
            (
                'success' => true,
                'result'  => $resultObject
            );
        }
        else
        {
            $retArray = array
            (
                'success' => false,
                'result'  => null
            );
        }
        return json_encode( $retArray );
    }
}

// HTML标签闭合检测. 如果$text的数据过大时, 可能存在一定的性能问题
function fixtags( $text ) {
    $text = htmlspecialchars( $text );
    $text = preg_replace( "/&quot;/", "&quot;\"", $text );
    $tags = "/&lt;(!|)(\/|)(\w*)(\ |)(\w*)([\\\=]*)(?|(\")\"&quot;\"|)(?|(.*)?&quot;(\")|)([\ ]?)(\/|)&gt;/i";
    $replacement = "<$1$2$3$4$5$6$7$8$9$10$11>";
    $text = preg_replace( $tags, $replacement, $text );
    $text = preg_replace( "/=\"\"/", "=", $text );
    $text = preg_replace( "/&quot;\"/", "\"", $text );
    return $text;
}

?>