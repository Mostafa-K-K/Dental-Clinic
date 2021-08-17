import React from "react"
import API from "../API"
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export default function ConfirmDelete(props) {

    async function onDelete() {
        await API.delete(props.path)
            .then(props.fetchData())
    }

    async function handleDelete() {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div>
                        <span>DELETE {props.name}</span>
                        <span>Are you sure you want to delete this {props.name}?</span>
                        <div>
                            <button
                                onClick={onClose}
                            >
                                Cnacel
                            </button>

                            <button
                                onClick={() => {
                                    onDelete()
                                    onClose();
                                }}
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                );
            }
        });
    }

    return (
        <a href="#" onClick={handleDelete} className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons">&#xE5C9;</i></a>
    )
}