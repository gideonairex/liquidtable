import {gql} from 'apollo-boost';

export const SUBSCRIPTION_TABLE_RESULT = gql`
    subscription GetTableResult($tableMetaId: Int){
        table_result(where:{table_meta_id:{_eq:$tableMetaId}}) {
            result
            id
        }
    }
`;