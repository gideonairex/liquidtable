import { gql } from 'apollo-boost'

export const MUTATION_UPDATE_META = gql`
    mutation UpdateTableMeta($id: Int, $meta : jsonb){
        update_table_meta(where: {
            id : {
                _eq : $id
            }
        }, _set :{
            meta : $meta
        }, ) {
            returning {
                id
            }
        }
    }
`;
