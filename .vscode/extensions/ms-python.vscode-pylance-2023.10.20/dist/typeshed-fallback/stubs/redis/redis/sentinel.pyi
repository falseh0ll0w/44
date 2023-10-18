from collections.abc import Iterable, Iterator
from typing import Any, TypeVar, overload
from typing_extensions import Literal, TypeAlias

from redis.client import Redis
from redis.commands.sentinel import SentinelCommands
from redis.connection import Connection, ConnectionPool, SSLConnection
from redis.exceptions import ConnectionError

_RedisT = TypeVar("_RedisT", bound=Redis[Any])
_AddressAndPort: TypeAlias = tuple[str, int]
_SentinelState: TypeAlias = dict[str, Any]  # TODO: this can be a TypedDict

class MasterNotFoundError(ConnectionError): ...
class SlaveNotFoundError(ConnectionError): ...

class SentinelManagedConnection(Connection):
    connection_pool: SentinelConnectionPool
    def __init__(self, *, connection_pool: SentinelConnectionPool, **kwargs) -> None: ...
    def connect_to(self, address: _AddressAndPort) -> None: ...
    def connect(self) -> None: ...
    # The result can be either `str | bytes` or `list[str | bytes]`
    def read_response(self, disable_decoding: bool = False, *, disconnect_on_error: bool = False) -> Any: ...

class SentinelManagedSSLConnection(SentinelManagedConnection, SSLConnection): ...

class SentinelConnectionPool(ConnectionPool):
    is_master: bool
    check_connection: bool
    service_name: str
    sentinel_manager: Sentinel
    def __init__(self, service_name: str, sentinel_manager: Sentinel, **kwargs) -> None: ...
    def reset(self) -> None: ...
    def owns_connection(self, connection: Connection) -> bool: ...
    def get_master_address(self) -> _AddressAndPort: ...
    def rotate_slaves(self) -> Iterator[_AddressAndPort]: ...

class Sentinel(SentinelCommands):
    sentinel_kwargs: dict[str, Any]
    sentinels: list[Redis[Any]]
    min_other_sentinels: int
    connection_kwargs: dict[str, Any]
    def __init__(
        self,
        sentinels: Iterable[_AddressAndPort],
        min_other_sentinels: int = 0,
        sentinel_kwargs: dict[str, Any] | None = None,
        **connection_kwargs,
    ) -> None: ...
    def check_master_state(self, state: _SentinelState, service_name: str) -> bool: ...
    def discover_master(self, service_name: str) -> _AddressAndPort: ...
    def filter_slaves(self, slaves: Iterable[_SentinelState]) -> list[_AddressAndPort]: ...
    def discover_slaves(self, service_name: str) -> list[_AddressAndPort]: ...
    @overload
    def master_for(self, service_name: str, *, connection_pool_class=..., **kwargs) -> Redis[Any]: ...
    @overload
    def master_for(self, service_name: str, redis_class: type[_RedisT], connection_pool_class=..., **kwargs) -> _RedisT: ...
    @overload
    def slave_for(self, service_name: str, *, connection_pool_class=..., **kwargs) -> Redis[Any]: ...
    @overload
    def slave_for(self, service_name: str, redis_class: type[_RedisT], connection_pool_class=..., **kwargs) -> _RedisT: ...
    def execute_command(self, *args, **kwargs) -> Literal[True]: ...
