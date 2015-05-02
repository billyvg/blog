<?php
/**
 * 公共方法类
 */
class OP
{
    /**
     * clearXss 过滤XSS 取自xxx
     * param  [String]  $string  [需要过滤的字符串]
     * param  [Boolean] $low     [true简单过滤]
     * param  [Return]           [过滤后的字符串]
     */
    public function clearXss( $string, $low = false )
    {
        if ( !is_array( $string ) )
        {
            $string = trim( $string );
            $string = strip_tags( $string );
            $string = htmlspecialchars( $string );
            if ( $low )
            {
                return $string;
            }
            $string = str_replace( array ('"', "\\", "'", "/", "..", "../", "./", "//" ), '', $string );
            $no = '/%0[0-8bcef]/';
            $string = preg_replace( $no, '', $string );
            $no = '/%1[0-9a-f]/';
            $string = preg_replace( $no, '', $string );
            $no = '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/S';
            $string = preg_replace( $no, '', $string );
            return $string;
        }
        $keys = array_keys( $string );
        foreach ( $keys as $key )
        {
            $this->clearXss( $string[$key] );
        }
    }
}
?>