import React, { useEffect } from 'react';
import { message } from 'antd';
import { useMachine } from '@xstate/react';
import { rootMachine } from '../../machines';

const Notification = () => {
    const [current] = useMachine(rootMachine);
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