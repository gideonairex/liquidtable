import {gql} from 'apollo-boost';

export const SUBSCRIPTION_TABLE_META = gql`
    subscription GetTableMeta($id: Int){
        table_meta (where:{id:{_eq:$id}}){
            name
            meta
        }
    }
`;