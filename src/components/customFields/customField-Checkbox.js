import React, { useEffect } from 'react';
import useCustomField from './useCustomField';
import Switch from 'antd/lib/switch';
import locales from '../../helpers/locales';

const CustomFieldCheckbox = ({ cf, updateValue, setIsValid }) => {
	const [
		{
			id,
			index,
			value,
			isDisabled,
			placeHolder,
			placeHolderOrName,
			title,
			manualMode,
		},
		setValue,
		storeValue,
	] = useCustomField(cf, updateValue);

	const handleChange = (e) => {
		setValue(e);
		manualMode && updateValue(id, e);
	};

	useEffect(() => {
		setIsValid({ id: id, isValid: true });
	}, []);

	return (
		<div
			key={id}
			index={index}
			className={`custom-field${isDisabled ? '-disabled' : ''}`}
		>
			<div
				className={`custom-field-inner-checkbox${
					isDisabled ? '-disabled' : ''
				}`}
			>
				{/* <div className="pomodoro__border"></div>
                <div className="pomodoro__box__content"> */}
				<Switch
					id={`switchboxCustomField${index}`}
					className="pomodoro__switch"
					checked={value}
					onChange={handleChange}
					disabled={isDisabled}
				/>
				<span
					className="clockify-switch-label"
					htmlFor={`switchboxCustomField${index}`}
					title={title}
				>
					{placeHolder ? placeHolder : name}
				</span>
				{/* </div> */}
			</div>
		</div>
	);
};

export default CustomFieldCheckbox;
