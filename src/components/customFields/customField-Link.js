import React, { useState, useRef, useEffect } from 'react';
import useCustomField from './useCustomField';
import { useOnClickOutside } from './useOnClickOutside';
import { getBrowser } from '../../helpers/browser-helper';
import locales from '../../helpers/locales';

const CustomFieldLink = ({ cf, updateValue, setIsValid }) => {
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
			required,
		},
		setValue,
		storeValue,
	] = useCustomField(cf, updateValue);

	const [valueTemp, setValueTemp] = useState(null);
	const handleChangeTemp = (e) => {
		const val = e.target.value;
		setValueTemp(val);
	};

	const [valueStay, setValueStay] = useState(value);
	const handleChangeStay = (e) => {
		const val = e.target.value;
		setIsValid({ id: id, isValid: !(required && !val) });
		setValueStay(val);
	};

	const storeStay = () => {
		setValue(valueStay);
		manualMode && updateValue(id, valueStay);
		// handleChangeDelayed.current(valueStay);
	};

	const [isModalOpen, setModalOpen] = useState(false);

	const ref = useRef();
	// Call hook passing in the ref and a function to call on outside click
	useOnClickOutside(ref, () => setModalOpen(false));

	const openModal = () => {
		setValueTemp(value);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const saveModal = () => {
		if (!valueTemp || value === valueTemp) {
			return;
		}
		setValue(valueTemp);
		setValueStay(valueTemp);
		setModalOpen(false);
	};

	const isNotValid = required && !value;

	useEffect(() => {
		setIsValid({ id: id, isValid: !(required && !cf.value) });
	}, []);
	return (
		<>
			<div>
				<div
					key={id}
					index={index}
					className={`custom-field${isDisabled ? '-disabled' : ''}`}
				>
					{value ? (
						<div
							className={`custom-field-inner${isDisabled ? '-disabled' : ''}`}
						>
							<a
								href={value}
								style={{ color: '#03a9f4', fontSize: '14px' }}
								target="_blank"
								title={title}
							>
								{placeHolderOrName}
							</a>
							{!isDisabled && (
								<img
									index={index}
									title={title}
									src={getBrowser().runtime.getURL(
										'assets/images/edit-unsynced.png'
									)}
									style={{
										marginLeft: '8px',
										width: '14px',
										height: '14px',
										cursor: 'pointer',
									}}
									className={isDisabled ? '' : 'clockify-close-dlg-icon'}
									onClick={() => openModal()}
								/>
							)}
						</div>
					) : (
						<input
							name={`txtCustomField${index}`}
							type="url"
							index={index}
							className={`custom-field-link clockify-link-input${
								isDisabled ? '-disabled' : ''
							} ${isNotValid ? 'custom-field-required' : ''}`}
							title={title}
							placeholder={placeHolderOrName}
							onChange={handleChangeStay}
							onBlur={storeStay}
							disabled={isDisabled}
							value={!!valueStay ? valueStay : ''}
						/>
					)}
				</div>

				{isModalOpen && (
					<div id="divClockifyLinkModal" className="clockify-modal">
						<div className="clockify-modal-content" ref={ref}>
							<div className="cl-modal-header">
								<h1 className="cl-modal-title">Edit link</h1>
								<button type="button" className="cl-close" onClick={closeModal}>
									<span aria-hidden="true">
										<span className="clockify-close"></span>
									</span>
								</button>
							</div>
							<div className="cl-modal-body">
								<div className="custom-field-link-label">
									{placeHolderOrName}
								</div>
								<input
									type="url"
									className="custom-field-link clockify-link-input-modal"
									placeholder={placeHolderOrName}
									autoComplete="off"
									onChange={handleChangeTemp}
									value={!!valueTemp ? valueTemp : ''}
								/>
							</div>
							<div className="cl-modal-footer">
								<a className="clockify-cancel" onClick={closeModal} disabled="">
									{locales.CANCEL}
								</a>
								<a
									className={`clockify-save${
										!valueTemp || value === valueTemp
											? ' clockify-save--disabled'
											: ''
									}`}
									onClick={saveModal}
									disabled=""
								>
									SAVE
								</a>
							</div>
						</div>
					</div>
				)}
			</div>
			{isNotValid && (
				<p className="field-required-message">*{cf.wsCustomField.name} {locales.FIELD_REQUIRED}</p>
			)}
		</>
	);
};

export default CustomFieldLink;
