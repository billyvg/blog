import styled from 'styled-components'
import {
    fontColor,
    fontAuxColor,
    auxColor,
    mediaEdge
} from '../styled-global/constant'

export const List = styled.div`
    padding: 2em 0;
    @media (max-width: ${mediaEdge}) {
        padding: 1em 0;
    }
`
export const ListItem = styled.div`
    margin-bottom: 2em;
    padding-bottom: 2em;
    border-bottom: 1px dashed ${auxColor};
    &:last-child {
        border: none;
        margin-bottom: 0;
    }
    @media (max-width: ${mediaEdge}) {
        margin-bottom: 1em;
        padding-bottom: 1em;
    }
`
export const ArticleTitle = styled.h2`
    font-weight: 300;
    &:before {
        content: '•';
        padding-right: .5em;
    }
    > a {
        color: ${fontColor};
        &:hover {
            text-decoration: underline;
        }
    }
    @media (max-width: ${mediaEdge}) {
        font-size: 1.8rem;
        &:before {
            display: none;
        }
    }
`
export const ArticleInfo = styled.div`
    font-size: 1.4rem;
    padding-left: 1.9em;
    color: ${fontAuxColor};
    @media (max-width: ${mediaEdge}) {
        padding: 0;
    }
`
export const ArticleInfoItem = styled.span`
    margin-right: 2.5em;
    vertical-align: top;
    @media (max-width: ${mediaEdge}) {
        &:first-child {
            display: none;
        }
    }
    > i {
        margin-right: .35em;
    }
`
