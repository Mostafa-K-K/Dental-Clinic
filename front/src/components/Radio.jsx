import React from 'react'

export default function Radio(props) {

    return (
        <div className={props.classFlexRadio}>
            <div>
                <input
                    type={props.type}
                    name={props.name}
                    value={props.value1}
                    id={props.id1}
                    checked={props.check === props.value1}
                    onChange={props.onChange}
                />
                <label htmlFor={props.id1} className={props.className}> {props.value1}</label>
            </div>
            <div>
                <input
                    type={props.type}
                    name={props.name}
                    value={props.value2}
                    id={props.id2}
                    checked={props.check === props.value2}
                    onChange={props.onChange}
                />
                <label htmlFor={props.id2} className={props.className}> {props.value2}</label>
            </div>
        </div>
    );
}