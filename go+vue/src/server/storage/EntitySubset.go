package storage

// EntitySubset is result of retrieval entities subset from storage
// providing total count of entities for paging logic
type EntitySubset struct {
	Items      interface{} `json:"items"`
	TotalCount int         `json:"totalCount"`
}
