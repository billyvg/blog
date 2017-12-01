import React from 'react'
import styled, { keyframes } from 'styled-components'

import { Input } from '../styled-global'
import { navMenus, socials } from '../../config/website'
import {
    bodyWidth,
    headHeight,
    bodyMaxWidth,
    auxColor,
    auxAnchorColor
} from '../styled-global/constant'

const Header = styled.div`
    width: 100%;
    height: ${headHeight};
    line-height: ${headHeight};
    background: #f8f8ff;
    border-bottom: 1px solid #efefef;
`
const Nav = styled.div`
    margin: 0 auto;
    width: ${bodyWidth};
    max-width: ${bodyMaxWidth};
`
const Menu = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: inline-block;
`
const MenuItem = styled.li`
    display: inline-block;
`
const MenuItemAnchor = styled.a`
    color: #808080;
    &.active {
        color: inherit;
        text-decoration: underline;
    }
`
const MenuItemDivision = styled.span`
    padding: 0 1em;
    color: #808080;
    :after {
        content: '·';
        color: ${auxAnchorColor};
    }
`
const Right = styled.div`
    top: 0;
    right: 0;
    position: absolute;
    & > div {
        display: inline-block;
    }
`
const RightSocial = styled.div`
    height: 22px;
    line-height: 22px;
    vertical-align: baseline;
    padding-right: 1.5em;
    margin-right: 1.5em;
    border-right: 1px solid ${auxColor};
`
const RightSocialAnchor = styled.a`
    color: ${auxAnchorColor};
    margin-left: 1.5em;
`
const RightSearch = styled.div`
    vertical-align: top;
    min-width: 1.5em;
`
const RightSearchAnimate = keyframes`
    from {
        width: 0;
    }
    to {
        width: 150px;
    }
`
const RightSearchInput = styled.input`
    ${Input};
    display: inline-block;
    position: relative;
    top: -2px;
    width: 0;
    animation: ${RightSearchAnimate} 300ms ease-in-out forwards;
`
const RightSearchIcon = styled.span`
    cursor: pointer;
    position: absolute;
    right: .5em;
    color: ${props => props.active ? '#000' : auxAnchorColor};
`

const ComponentMenuList = props => navMenus.map((menu, index) => (
    <MenuItem key={menu.path}>
        <MenuItemAnchor
            href={menu.path}
            className={`${props.path === menu.path ? 'active' : ''}`}
        >{menu.name}</MenuItemAnchor>
        {index === navMenus.length - 1 ? null : <MenuItemDivision />}
    </MenuItem>
))

const ComponentSocial = () => socials.map(social => (
    <RightSocialAnchor key={social.link} href={social.link} target="_blank">
        <i className={`iconfont icon-${social.icon}`}></i>
    </RightSocialAnchor>
))

export default class extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            searchValue: '',
            searchVisible: false
        }
    }

    clickSearch (e) {
        let { searchVisible, searchValue } = this.state

        // 再次点击去到搜索页面
        if (searchVisible) {
            searchValue = searchValue.trim()
            if (searchValue) {
                this.gotoSearch(searchValue)
            } else {
                this.refInput.focus()
                this.refInput.value = searchValue
            }
        } else {
            this.setState({
                searchVisible: true
            })
        }
    }

    gotoSearch (searchValue) {
        console.log('gotoSearch: ', searchValue)
    }

    componentDidMount () {
        document.addEventListener('click', e => {
            if (e.timeStamp !== this.ckTimeStamp) {
                this.setState({
                    searchVisible: false
                })
            }
        })

        document.addEventListener('keyup', e => {
            let { searchValue } = this.state
            searchValue = searchValue.trim()

            if (e.keyCode === 13 && searchValue) {
                this.gotoSearch(searchValue)
            }
        })
    }

    render () {
        const { searchVisible } = this.state

        return (
            <Header>
                <Nav>
                    <Menu>
                        <ComponentMenuList path={this.props.path} />
                    </Menu>
                    <Right>
                        <RightSocial>
                            <ComponentSocial />
                        </RightSocial>
                        <RightSearch onClick={e => { this.ckTimeStamp = e.timeStamp }}>
                            {!searchVisible ? null
                                : <RightSearchInput
                                    placeholder="搜索文章、内容"
                                    onAnimationEnd={e => e.target.focus()}
                                    innerRef={input => { this.refInput = input }}
                                    onChange={e => this.setState({ searchValue: e.target.value })}
                                />
                            }
                            <RightSearchIcon
                                active={searchVisible}
                                onClick={this.clickSearch.bind(this)}
                            >
                                <i className="iconfont icon-search"></i>
                            </RightSearchIcon>
                        </RightSearch>
                    </Right>
                </Nav>
            </Header>
        )
    }
}
