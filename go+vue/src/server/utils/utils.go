package utils

import "strconv"

// DefaultString returns passed string or default if passed string is empty
func DefaultString(val, def string) string {
	if val == "" {
		return def
	}

	return val
}

// DefaultInteger returns passed integer or default if passed integer is empty or invalid
func DefaultInteger(val string, def int) int {
	if val == "" {
		return def
	}

	i, err := strconv.Atoi(val)
	if err != nil {
		return def
	}

	return i
}
