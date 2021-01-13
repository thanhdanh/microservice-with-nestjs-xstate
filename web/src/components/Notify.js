import React, { useContext, useEffect } from 'react';
import { message } from 'antd';
import MachineContext from '../context';
import { useService } from '@xstate/react';

const Notification = () => {
    const service = useContext(MachineContext);
    const [current] = useService(service);

    const { successMessage, errorMessage } = current.context;

    useEffect(() => {
        successMessage && message.success(successMessage);
    }, [successMessage])

    useEffect(() => {
        errorMessage && message.error(errorMessage);
    }, [errorMessage])

    return (
        <></>
    )
}

export default Notification;