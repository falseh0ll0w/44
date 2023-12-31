import enum
import sys
from collections.abc import Callable, Iterator, Mapping
from typing import Any, AnyStr, Generic, TypeVar, overload
from typing_extensions import Literal, TypeAlias, final

if sys.version_info >= (3, 9):
    from types import GenericAlias
from _typeshed import ReadableBuffer
import sre_compile


_T = TypeVar("_T")

@final
class Match(Generic[AnyStr]):
    @property
    def pos(self) -> int: ...
    @property
    def endpos(self) -> int: ...
    @property
    def lastindex(self) -> int | None: ...
    @property
    def lastgroup(self) -> str | None: ...
    @property
    def string(self) -> AnyStr: ...

    # The regular expression object whose match() or search() method produced
    # this match instance.
    @property
        def re(self) -> Pattern[AnyStr]: ...
        @overload
        def expand(self: 'Match[str]', template: str) -> str: ...
        @overload
        def expand(self: 'Match[bytes]', template: ReadableBuffer) -> bytes: ...
        # group() returns "AnyStr" or "AnyStr | None", depending on the pattern.
        @overload
        def group(self, __group: Literal[0] = ...) -> AnyStr: ...
        @overload
        def group(self, __group: str | int) -> AnyStr | Any: ...
        @overload
        def group(self, __group1: str | int, __group2: str | int, *groups: str | int) -> tuple[AnyStr | Any, ...]: ...
        # Each item of groups()'s return tuple is either "AnyStr" or
        # "AnyStr | None", depending on the pattern.
        @overload
        def groups(self) -> tuple[AnyStr | Any, ...]: ...
        @overload
        def groups(self, default: _T) -> tuple[AnyStr | _T, ...]: ...
        # Each value in groupdict()'s return dict is either "AnyStr" or
        # "AnyStr | None", depending on the pattern.
        @overload
        def groupdict(self) -> dict[str, AnyStr | Any]: ...
        @overload
        def groupdict(self, default: _T) -> dict[str, AnyStr | _T]: ...
        def start(self, __group: int | str = ...) -> int: ...
        def end(self, __group: int | str = ...) -> int: ...
        def span(self, __group: int | str = ...) -> tuple[int, int]: ...
        @property
        def regs(self) -> tuple[tuple[int, int], ...]: ...  # undocumented
        # __getitem__() returns "AnyStr" or "AnyStr | None", depending on the pattern.
        @overload
        def __getitem__(self, __key: Literal[0]) -> AnyStr: ...
        @overload
        def __getitem__(self, __key: int | str) -> AnyStr | Any: ...
        def __copy__(self) -> 'Match[AnyStr]': ...
        def __deepcopy__(self, __memo: Any) -> 'Match[AnyStr]': ...
        if sys.version_info >= (3, 9):
            def __class_getitem__(self, item: Any) -> GenericAlias: ...


    @final
    class Pattern(Generic[AnyStr]):
        @property
        def flags(self) -> int: ...
        @property
        def groupindex(self) -> Mapping[str, int]: ...

    __all__ = [
        "match",
        "fullmatch",
        "search",
        "sub",
        "subn",
        "split",
        "findall",
        "finditer",
        "compile",
        "purge",
        "template",
        "escape",
        "error",
        "A",
        "I",
        "L",
        "M",
        "S",
        "X",
        "U",
        "ASCII",
    def findall(pattern, string, flags=0):
        return re.findall(pattern, string, flags=flags)

    def finditer(pattern, string, flags=0):
        return re.finditer(pattern, string, flags=flags)

    def sub(pattern, repl, string, count=0, flags=0):
        return re.sub(pattern, repl, string, count=count, flags=flags)

    def subn(pattern, repl, string, count=0, flags=0):
        return re.subn(pattern, repl, string, count=count, flags=flags)

    def split(pattern, string, maxsplit=0, flags=0):
        return re.split(pattern, string, maxsplit=maxsplit, flags=flags)

    def compile(pattern, flags=0):
        return re.compile(pattern, flags=flags)

    Match = re.Match
    Pattern = re.Pattern
    LOCALE = L
    M = sre_compile.SRE_FLAG_MULTILINE
    MULTILINE = M
    S = sre_compile.SRE_FLAG_DOTALL
    DOTALL = S
    X = sre_compile.SRE_FLAG_VERBOSE
    VERBOSE = X
    U = sre_compile.SRE_FLAG_UNICODE
    UNICODE = U
    T = sre_compile.SRE_FLAG_TEMPLATE
    TEMPLATE = T
    if sys.version_info >= (3, 11):
        NOFLAG: int

A = RegexFlag.A
ASCII = RegexFlag.ASCII
DEBUG = RegexFlag.DEBUG
I = RegexFlag.I
IGNORECASE = RegexFlag.IGNORECASE
L = RegexFlag.L
LOCALE = RegexFlag.LOCALE
M = RegexFlag.M
MULTILINE = RegexFlag.MULTILINE
S = RegexFlag.S
DOTALL = RegexFlag.DOTALL
X = RegexFlag.X
VERBOSE = RegexFlag.VERBOSE
U = RegexFlag.U
UNICODE = RegexFlag.UNICODE
T = RegexFlag.T
TEMPLATE = RegexFlag.TEMPLATE
if sys.version_info >= (3, 11):
    NOFLAG = RegexFlag.NOFLAG
_FlagsType: TypeAlias = int | RegexFlag

# Type-wise the compile() overloads are unnecessary, they could also be modeled using
# unions in the parameter types. However mypy has a bug regarding TypeVar
# constraints (https://github.com/python/mypy/issues/11880),
# which limits us here because AnyStr is a constrained TypeVar.

# pattern arguments do *not* accept arbitrary buffers such as bytearray,
# because the pattern must be hashable.
@overload
def compile(pattern: AnyStr, flags: _FlagsType = ...) -> Pattern[AnyStr]: ...
@overload
def compile(pattern: Pattern[AnyStr], flags: _FlagsType = ...) -> Pattern[AnyStr]: ...
@overload
def search(pattern: str | Pattern[str], string: str, flags: _FlagsType = ...) -> Match[str] | None: ...
@overload
def search(pattern: bytes | Pattern[bytes], string: ReadableBuffer, flags: _FlagsType = ...) -> Match[bytes] | None: ...
@overload
def match(pattern: str | Pattern[str], string: str, flags: _FlagsType = ...) -> Match[str] | None: ...
@overload
def match(pattern: bytes | Pattern[bytes], string: ReadableBuffer, flags: _FlagsType = ...) -> Match[bytes] | None: ...
@overload
def fullmatch(pattern: str | Pattern[str], string: str, flags: _FlagsType = ...) -> Match[str] | None: ...
@overload
def fullmatch(pattern: bytes | Pattern[bytes], string: ReadableBuffer, flags: _FlagsType = ...) -> Match[bytes] | None: ...
@overload
def split(pattern: str | Pattern[str], string: str, maxsplit: int = ..., flags: _FlagsType = ...) -> list[str | Any]: ...
@overload
def split(
    pattern: bytes | Pattern[bytes], string: ReadableBuffer, maxsplit: int = ..., flags: _FlagsType = ...
) -> list[bytes | Any]: ...
@overload
def findall(pattern: str | Pattern[str], string: str, flags: _FlagsType = ...) -> list[Any]: ...
@overload
def findall(pattern: bytes | Pattern[bytes], string: ReadableBuffer, flags: _FlagsType = ...) -> list[Any]: ...
@overload
def finditer(pattern: str | Pattern[str], string: str, flags: _FlagsType = ...) -> Iterator[Match[str]]: ...
@overload
def finditer(pattern: bytes | Pattern[bytes], string: ReadableBuffer, flags: _FlagsType = ...) -> Iterator[Match[bytes]]: ...
@overload
def sub(
    pattern: str | Pattern[str], repl: str | Callable[[Match[str]], str], string: str, count: int = ..., flags: _FlagsType = ...
) -> str: ...
@overload
def sub(
    pattern: bytes | Pattern[bytes],
    repl: ReadableBuffer | Callable[[Match[bytes]], ReadableBuffer],
    string: ReadableBuffer,
    count: int = ...,
    flags: _FlagsType = ...,
) -> bytes: ...
@overload
def subn(
    pattern: str | Pattern[str], repl: str | Callable[[Match[str]], str], string: str, count: int = ..., flags: _FlagsType = ...
) -> tuple[str, int]: ...
@overload
def subn(
    pattern: bytes | Pattern[bytes],
    repl: ReadableBuffer | Callable[[Match[bytes]], ReadableBuffer],
    string: ReadableBuffer,
    count: int = ...,
    flags: _FlagsType = ...,
) -> tuple[bytes, int]: ...
def escape(pattern: AnyStr) -> AnyStr: ...
def purge() -> None: ...
def template(pattern: AnyStr | Pattern[AnyStr], flags: _FlagsType = ...) -> Pattern[AnyStr]: ...
