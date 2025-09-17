/* eslint-disable @typescript-eslint/no-unused-vars */
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

type Props = {
    next?: boolean;
    prev?: boolean;
    handleAction?: () => void;
};

const NavigatonSlider = ({ next, prev, handleAction, ...passProps }: Props) => {
    if (prev) {
        return (
            <div
                onClick={() => handleAction && handleAction()}
                className='absolute top-1/2 -left-12 z-[1] translate-y-[-50%] cursor-pointer rounded-[2px] bg-black/50 px-3 py-3 duration-300 select-none hover:bg-black/40'
                {...passProps}
            >
                <LeftOutlined style={{ color: '#fff', fontSize: 20 }} />
            </div>
        );
    }
    return (
        <div
            onClick={() => handleAction && handleAction()}
            className='absolute top-1/2 -right-12 z-[1] translate-y-[-50%] cursor-pointer rounded-[2px] bg-black/50 px-3 py-3 duration-300 select-none hover:bg-black/40'
            {...passProps}
        >
            <RightOutlined style={{ color: '#fff', fontSize: 20 }} />
        </div>
    );
};

export default NavigatonSlider;
