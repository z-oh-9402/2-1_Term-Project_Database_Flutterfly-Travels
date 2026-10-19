import { useRef, useState } from "react";
import "../Styles/form-fields.css"

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const wholeNumber = /^\d+$/;

// The field an element belongs to: an input, the input a label is for, or a [data-field] wrapper (a photo)
const fieldOf = (element) => {
    if(element.matches('input, select, textarea'))
    {
        return element;
    }
    return element.closest('[data-field]') ?? element.closest('label')?.control ?? null;
}

const fieldName = (field) => field.name || field.dataset.field;

// Rules for the fields of a form (sign-up, edit profile). fieldError(name) says what is wrong with a field, or null.
// While the field the user is in breaks its rule, no other field can be clicked or tabbed into,
// and only that field's warning shows. Buttons and links keep working.
// dependsOn maps a field to the one its rule compares against ({rePassword: 'password'}): while the first is wrong,
// the user may go to the second to fix it, but from there only back to the first until it is right.
const useFieldRules = (fieldError, dependsOn = {}) => {
    const containerRef = useRef(null);
    const currentRef = useRef(null); // the field the user is in
    const [currentField, setCurrentField] = useState(null); // its name
    const [touched, setTouched] = useState({}); // fields typed in, or that the user tried to leave while wrong
    const [nudges, setNudges] = useState(0); // counts blocked moves, to shake the warning again

    const markTouched = (name) => setTouched(t => t[name] ? t : {...t, [name]: true});

    // The field that has to be fixed before the user can move to this one, or null when the move is fine
    const blockingField = (field) => {
        const current = currentRef.current;
        if(current === null || !current.isConnected || fieldName(current) === fieldName(field))
        {
            return null;
        }
        const currentName = fieldName(current);
        if(fieldError(currentName) !== null)
        {
            return dependsOn[currentName] === fieldName(field) ? null : current;
        }
        // the field the user is in is fine, but they came here from a field that depends on it, which is still wrong
        const dependent = Object.keys(dependsOn).find(name => dependsOn[name] === currentName && name !== fieldName(field)
                                                              && touched[name] && fieldError(name) !== null);
        return dependent ? containerRef.current.querySelector(`[name="${dependent}"]`) : null;
    }

    // Sends the user to the field they have to fix, with its warning showing
    const holdField = (field) => {
        field.focus();
        markTouched(fieldName(field));
        setNudges(n => n + 1);
    }

    // Clicks on another field do nothing while the current one is wrong
    const guardPointer = (e) => {
        const field = fieldOf(e.target);
        const blocker = field && blockingField(field);
        if(blocker)
        {
            e.preventDefault();
            e.stopPropagation();
            holdField(blocker);
        }
    }

    // Tabbing into another field is sent back the same way
    const guardFocus = (e) => {
        const field = fieldOf(e.target);
        if(!field)
        {
            return;
        }
        const blocker = blockingField(field);
        if(blocker)
        {
            holdField(blocker);
        }
        else
        {
            currentRef.current = field;
            setCurrentField(fieldName(field));
        }
    }

    // A field's warning, once it has been typed in or the user tried to leave it while wrong.
    // While the field the user is in is wrong, only its own warning shows.
    const shownWarning = (name) => {
        const currentIsWrong = currentField !== null && currentField !== name && fieldError(currentField) !== null;
        return touched[name] && !currentIsWrong ? fieldError(name) : null;
    }

    // The warning slot under a row of fields (two on the agent's experience/fee row).
    // It keeps its height when empty, so warnings never change the layout.
    const warning = (...names) => {
        const name = names.find(n => shownWarning(n) !== null);
        return (
            <div className='field-warning-slot'>
                {name && <h5 key={`${name}-${nudges}`} className='field-warning'>{shownWarning(name)}</h5>}
            </div>
        );
    }

    // for the red border on a field whose warning is showing
    const invalid = (name) => shownWarning(name) !== null;

    // Goes to a field that breaks its rule and shows its warning (for Next / Save buttons)
    const showProblem = (name) => {
        containerRef.current.querySelector(`[name="${name}"]`)?.focus();
        markTouched(name);
        setNudges(n => n + 1);
    }

    // The fields the user was in are going away (another page, or the form closes)
    const releaseField = () => {
        currentRef.current = null;
        setCurrentField(null);
    }

    // Starts over, as for a freshly opened form
    const resetRules = () => {
        releaseField();
        setTouched({});
    }

    // Spread onto the element around the fields
    const containerProps = {
        ref: containerRef,
        onMouseDownCapture: guardPointer,
        onClickCapture: guardPointer,
        onFocusCapture: guardFocus,
        // in the bubble phase: a state update in a capture handler would re-render the input before its own onChange runs
        onInput: (e) => e.target.name && markTouched(e.target.name),
    };

    return { containerProps, warning, invalid, showProblem, releaseField, resetRules };
}

export default useFieldRules;
