import React, {useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {compose, graphql, Subscription, withApollo} from 'react-apollo';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {MUTATION_UPDATE_META} from "./mutations/table_meta";
import {MUTATION_INSERT_TABLE_RESULT, MUTATION_UPDATE_TABLE_RESULT} from "./mutations/table_result";
import {SUBSCRIPTION_TABLE_META} from "./subscriptions/table_meta";
import TextEditor from './components/TextEditor';
import _ from 'lodash';
import {SUBSCRIPTION_TABLE_RESULT} from "./subscriptions/table_result";

/** for testing purposes **/
const tableMetaId = 1;

const App = ({updateTableMeta, insertTableResult, updateTableResult}) => {
    let columns = {};

    const [newField, setNewField] = useState(null);

    const addField = async () => {
        let newFieldMeta = {};
        newFieldMeta[newField] = {
            headerName: newField,
            field: newField.split(' ').join('_').toLowerCase(),
            sortable: true,
            resizable: true,
            order: Object.keys(columns).length + 1,
            cellEditor: "textEditor",
            editable: true
        };

        await updateTableMeta({
            variables: {
                id: tableMetaId,
                meta: {
                    ...columns,
                    ...newFieldMeta
                }
            }
        });

        setNewField('');
    };

    const newFieldChange = (e) => {
        setNewField(e.target.value);
    };

    const addRow = async () => {
        let newObject = {};
        Object.keys(columns).forEach((key) => {
            let field = columns[key].field;
            newObject[field] = '';
        });
        await insertTableResult({
            variables: {
                tableMetaId,
                result : newObject
            }
        });
    };

    const onCellValueChanged = async ({data}) => {
        let id = data.id;
        delete data.id;
        await updateTableResult({
            variables : {
                id,
                result : data
            }
        });
    };

    return (
        <div
            className="ag-theme-balham"
            style={{
                height: '500px',
                width: '100%'
            }}
        >
            <button onClick={addField}>Add Field</button>
            <input onChange={newFieldChange} value={newField} type="text"/>
            <button onClick={addRow}>Add Row</button>
            <Subscription subscription={SUBSCRIPTION_TABLE_META} variables={{id: tableMetaId}}>
                {({data, loading}) => {
                    if (loading) {
                        return <h1>Fetching Meta</h1>
                    }

                    if (!data.table_meta.length) {
                        return <h1>No table found please check the readme.md</h1>
                    }
                    let meta = Object.keys(data.table_meta[0].meta).map((field) => {
                        return data.table_meta[0].meta[field];
                    });

                    columns = data.table_meta[0].meta;

                    meta = _.sortBy(meta, ['order']);

                    return <Subscription subscription={SUBSCRIPTION_TABLE_RESULT}
                                         variables={{tableMetaId: tableMetaId}}>
                        {({data, loading}) => {
                            if (loading) {
                                return <h1>Fetching Data</h1>
                            }

                            let rows = data.table_result.map(({id, result})=>{
                                result.id = id;
                                return result;
                            });

                            return <AgGridReact
                                animateRows={true}
                                columnDefs={meta}
                                frameworkComponents={{
                                    textEditor: TextEditor
                                }}
                                onCellValueChanged={onCellValueChanged}
                                rowData={rows}>
                            </AgGridReact>
                        }}
                    </Subscription>
                }}
            </Subscription>

        </div>
    );
};

export default compose(
    graphql(MUTATION_UPDATE_META, {
        name: 'updateTableMeta',
    }),
    graphql(MUTATION_UPDATE_TABLE_RESULT, {
        name: 'updateTableResult',
    }),
    graphql(MUTATION_INSERT_TABLE_RESULT,{
        name: 'insertTableResult'
    }),
    withApollo
)(App);