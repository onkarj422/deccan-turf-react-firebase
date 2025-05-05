import {
    CollectionReference,
    DocumentData,
    DocumentSnapshot,
    Query,
    QueryConstraint,
    query,
    where,
    orderBy,
    startAfter,
    limit,
} from 'firebase/firestore';

  // Define all supported comparison operators
  type FirestoreWhereFilterOp =
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'not-in';

// Type for individual filters
export interface FirestoreFilter {
    field: string;
    op: FirestoreWhereFilterOp;
    value: unknown;
    enabled?: boolean; // optional toggle
  }

// Type for ordering
export interface FirestoreOrder {
    field: string;
    direction?: 'asc' | 'desc';
  }

// Options for the query builder
export interface FirestoreQueryOptions {
    filters?: FirestoreFilter[];
    orderBy?: FirestoreOrder[];
    startAfterDoc?: DocumentSnapshot<DocumentData>;
    limit?: number;
  }

/**
   * Builds a Firestore query with AND filtering, ordering, pagination, and limit.
   */
export function buildFirestoreQuery<T = DocumentData>(
    colRef: CollectionReference<T>,
    options: FirestoreQueryOptions,
): Query<T> {
    const constraints: QueryConstraint[] = [];

    // Add filters
    options.filters?.forEach((filter) => {
        if (filter.enabled === false) return;
        if (filter.value === undefined || filter.value === null) return;
        constraints.push(where(filter.field, filter.op, filter.value));
    });

    // Add ordering
    options.orderBy?.forEach((ord) => {
        constraints.push(orderBy(ord.field, ord.direction || 'asc'));
    });

    // Add pagination
    if (options.startAfterDoc) {
        constraints.push(startAfter(options.startAfterDoc));
    }

    // Add limit
    if (options.limit) {
        constraints.push(limit(options.limit));
    }

    return query(colRef, ...constraints);
}
