import {gql} from 'apollo-boost'

export const MUTATION_UPDATE_TABLE_RESULT = gql`
    mutation UpdateTableResult($id: Int, $result : jsonb){
        update_table_result(where: {
            id : {
                _eq : $id
            }
        }, _set :{
            result : $result
        }, ) {
            returning {
                id
            }
        }
    }
`;

export const MUTATION_INSERT_TABLE_RESULT = gql`
    mutation InsertTableResult($tableMetaId: Int, $result : jsonb){
        insert_table_result(objects: [{
            result : $result,
            table_meta_id : $tableMetaId
        }]) {
            returning {
                id
            }
        }
    }
`;
