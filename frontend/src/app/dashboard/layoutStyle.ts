import Colors from '@/styles/Colors';
import Link from 'next/link';
import styled, { css } from 'styled-components';

const color = {
    blue: '#287bff',
    white: '#fff',
    grey: '#f5f5f5',
    black1: '#222',
    black2: '#999',
};

interface toggleProps {
    $toggle: boolean;
}

export const ContainerWrapper = styled.div`
    height: 100vh;
    position: relative;
    width: 100%;
`;

export const Navigation = styled.div<toggleProps>`
    position: fixed;
    width: 300px;
    height: 100%;
    background: #353535;
    border-left: 10px solid #353535;
    transition: 0.5s;
    overflow: hidden;

    & ul {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    ${({ $toggle }) =>
        $toggle &&
        css`
            width: 0px;
        `}

    @media screen and (max-width: 991px) {
        left: -300px;
        ${({ $toggle }) =>
            $toggle &&
            css`
                width: 300px;
                left: 0;
            `}
    }

    @media screen and (max-width: 480px) {
        width: 100%;
        left: -100%;
        z-index: 1000;

        ${({ $toggle }) =>
            $toggle &&
            css`
                width: 100%;
                left: 0;
            `}
    }
`;

export const NavList = styled.li`
    position: relative;
    width: 100%;
    list-style: none;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;

    &:hover {
        background: ${color.white};

        & a * {
            color: ${Colors.SkyBlue};
        }

        & a::before {
            content: '';
            position: absolute;
            right: 0;
            top: -50px;
            width: 50px;
            height: 50px;
            background: transparent;
            border-radius: 50%;
            box-shadow: 35px 35px 0 10px ${color.white};
            pointer-events: none;
        }

        & a::after {
            content: '';
            position: absolute;
            right: 0;
            bottom: -50px;
            width: 50px;
            height: 50px;
            background: transparent;
            border-radius: 50%;
            box-shadow: 35px -35px 0 10px ${color.white};
            pointer-events: none;
        }
    }

    &:nth-child(1) {
        margin-bottom: 40px;
    }
`;

export const NavItemLink = styled(Link)`
    position: relative;
    display: block;
    width: 100%;
    display: flex;
    text-decoration: none;
    & * {
        color: ${color.white};
    }
`;

export const NavIconLine = styled.span`
    position: relative;
    display: block;
    min-width: 60px;
    height: 60px;
    line-height: 70px;
    text-align: center;

    & svg {
        font-size: 1.75rem;
    }
`;

export const Title = styled.span`
    position: relative;
    display: block;
    padding: 0 10px;
    height: 60px;
    line-height: 60px;
    text-align: start;
    white-space: nowrap;
`;

export const MainWrapper = styled.div<toggleProps>`
    position: absolute;
    width: calc(100% - 300px);
    left: 300px;
    min-height: 100vh;
    transition: 0.5s;
    background: #eeeeee;

    ${({ $toggle }) =>
        $toggle &&
        css`
            width: 100%;
            left: 0px;
        `}
    @media screen and (max-width: 991px) {
        width: 100%;
        left: 0;

        ${({ $toggle }) =>
            $toggle &&
            css`
                left: 300px;
            `}
    }
`;
export const TopBar = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
`;
export const Toggle = styled.div<toggleProps>`
    position: relative;
    top: 0;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.5em;
    cursor: pointer;
    @media screen and (max-width: 480px) {
        z-index: 10001;

        ${({ $toggle }) =>
            $toggle &&
            css`
                & svg path {
                    position: fixed;
                    right: 0;
                    left: initial;
                    color: ${color.white};
                }
            `}
    }
`;

export const CardBox = styled.div`
    position: relative;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    @media screen and (max-width: 991px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 480px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;
export const Card = styled.div`
    position: relative;
    background: ${color.white};
    padding: 30px;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);

    &:hover {
        background: ${Colors.SkyBlue};
        & * {
            color: ${color.white};
        }
    }
`;
export const Numbers = styled.div`
    position: relative;
    font-size: 2.5em;
    color: ${Colors.SkyBlue};
`;
export const CardName = styled.div`
    color: ${color.black2};
    font-size: 1.1em;
    margin-top: 5px;
`;
export const IconBox = styled.div`
    color: ${color.black2};
    & svg {
        font-size: 3.5em;
    }
`;

// order details list
export const Details = styled.div`
    position: relative;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 30px;
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;
export const RecentOrders = styled.div`
    position: relative;
    display: grid;
    min-height: 500px;
    background: ${color.white};
    padding: 20px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    @media screen and (max-width: 768px) {
        overflow-x: auto;
    }
`;
export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;
export const CardTitle = styled.h2`
    color: ${Colors.SkyBlue};
    @media screen and (max-width: 480px) {
        font-size: 20px;
    }
`;
export const DetailButton = styled(Link)`
    position: relative;
    padding: 5px 10px;
    background: ${Colors.SkyBlue};
    text-decoration: none;
    color: ${color.white};
    border-radius: 6px;
`;

export const OrderTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    & tr:last-child {
        border-bottom: none;
    }

    & tr td {
        padding: 10px;

        &:last-child {
            text-align: end;
        }
        &:nth-child(2) {
            text-align: center;
        }
        &:nth-child(3) {
            text-align: center;
        }
    }
`;

export const TableUnderRow = styled.tr`
    color: ${color.black1};
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
        background: ${Colors.SkyBlue};
        color: ${color.white};
    }
`;

export const RecentCustomers = styled.div`
    position: relative;
    display: grid;
    min-height: 500px;
    padding: 20px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    background: ${color.white};
`;

export const RecentCustomersTableRow = styled.tr`
    & td {
        padding: 12px 10px;
        & h4 {
            font-size: 16px;
            line-height: 1.2em;
            & span {
                font-size: 14px;
                color: ${color.black2};
            }
        }
    }

    &:hover {
        background-color: ${Colors.SkyBlue};
        color: ${color.white};

        & td h4 span {
            color: ${color.white};
        }
    }
`;

export const CustomerImageBox = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    & img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
