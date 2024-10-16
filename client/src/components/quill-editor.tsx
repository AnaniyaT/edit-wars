import {forwardRef, MutableRefObject, useEffect, useLayoutEffect, useRef} from 'react';
import Quill, { Delta, EmitterSource, Range, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
    readOnly?: boolean;
    defaultValue?: [Delta | Op[], EmitterSource?];
    onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
    onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => void;
    className?: string;
}

// Editor is an uncontrolled React component
const QuillEditor = forwardRef<HTMLDivElement, QuillEditorProps>(
    ({ readOnly, defaultValue, onTextChange, onSelectionChange, className }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const defaultValueRef = useRef(defaultValue);
        const onTextChangeRef = useRef(onTextChange);
        const onSelectionChangeRef = useRef(onSelectionChange);

        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
            onSelectionChangeRef.current = onSelectionChange;
        });

        useEffect(() => {
            (ref as MutableRefObject<Quill | null>).current?.enable(!readOnly);
        }, [ref, readOnly]);

        useEffect(() => {
            const container = containerRef.current;
            const editorContainer = container?.appendChild(
                container.ownerDocument.createElement('div'),
            );
            const quill = new Quill(editorContainer!, {});

            (ref as MutableRefObject<Quill | null>).current = quill;

            if (defaultValueRef.current) {
                quill.setContents(...defaultValueRef.current);
            }

             quill.on(Quill.events.TEXT_CHANGE, (...args) => {
                onTextChangeRef.current?.(...args);
            });

            quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
                onSelectionChangeRef.current?.(...args);
            });

            return () => {
                (ref as MutableRefObject<Quill | null>).current = null;
                container!.innerHTML = '';
            };
        }, [ref]);

        return <div className={className} ref={containerRef}></div>;
    },
);``

QuillEditor.displayName = 'Editor';

export default QuillEditor;