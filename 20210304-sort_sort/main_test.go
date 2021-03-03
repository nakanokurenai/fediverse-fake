package main_test

import (
	"sort"
	"testing"
)

// 順番を含めて同じかどうか
func equals(a []int, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i, ae := range a {
		if ae != b[i] {
			return false
		}
	}
	return true
}

func TestSubstitutionCopy(t *testing.T) {
	expected := []int{1, 3, 5}
	from := []int{1, 5, 3}
	to := from
	sort.Slice(to, func(i, j int) bool {
		return to[i] < to[j]
	})
	if !equals(to, expected) {
		t.Fatalf("期待と異なる結果です. %+v != %+v", to, expected)
	}
	if equals(from, to) {
		t.Fatal("破壊的変更がコピー元にも及んでいます")
	}
}

func TestCopyCopy(t *testing.T) {
	expected := []int{1, 3, 5}
	from := []int{1, 5, 3}
	to := make([]int, len(from))
	copy(to, from)

	sort.Slice(to, func(i, j int) bool {
		return to[i] < to[j]
	})
	if !equals(to, expected) {
		t.Fatalf("期待と異なる結果です. %+v != %+v", to, expected)
	}
	if equals(from, to) {
		t.Fatal("破壊的変更がコピー元にも及んでいます")
	}
}
