"use client";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { forwardRef, ForwardedRef } from "react";

type ModalSettingsPropsType = {
    show: boolean,
    onHide: () => void,
    darkModeChecked: boolean,
    flashingChecked: boolean,
    handleThemeToggle: () => void,
    handleFlashingToggle: () => void
}

type ModalRef = ForwardedRef<HTMLInputElement | null>

const ModalSettings = forwardRef(function ModalSettings(props: ModalSettingsPropsType, ref: ModalRef) {
    const { show, onHide, darkModeChecked, flashingChecked, handleThemeToggle, handleFlashingToggle } = props;

    return (
        <Modal
            show={show}
            size="sm"
            onHide={onHide}
            aria-labelledby="modal-settings">
            <Modal.Header closeButton>
                <Modal.Title id="modal-settings">
                Settings
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Check
                    type="switch"
                    id="theme-switch"
                    className="d-flex justify-content-between flex-row-reverse ps-0"
                    label="Toggle Dark theme"
                    ref={ref}
                    checked={darkModeChecked}
                    onChange={handleThemeToggle} />
                <Form.Check
                    type="switch"
                    id="flashing-switch"
                    className="d-flex justify-content-between flex-row-reverse ps-0"
                    label="Toggle flashing indicators"
                    checked={flashingChecked}
                    onChange={handleFlashingToggle} />
            </Modal.Body>
        </Modal>
    )
});

export default ModalSettings;